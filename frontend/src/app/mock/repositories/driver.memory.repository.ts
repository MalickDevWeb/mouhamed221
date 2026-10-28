import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FieldError } from '../../core/http/api-error';
import { isActive } from '../../features/assignments/assignment.models';
import { DriverRepository } from '../../features/drivers/data/driver.repository';
import { Driver, DriverInput, DriverQuery } from '../../features/drivers/driver.models';
import { matchesSearch, paginate } from '../../shared/data/search';
import { Page } from '../../shared/models/page';
import { InMemoryDb } from '../in-memory-db';
import { conflict, notFound, simulate } from '../simulate';

@Injectable()
export class DriverMemoryRepository extends DriverRepository {
  private readonly db = inject(InMemoryDb);

  override list(query: DriverQuery): Observable<Page<Driver>> {
    return simulate(() => {
      const items = this.db.drivers
        .filter((driver) => !query.status || driver.status === query.status)
        .filter((driver) => !query.site || driver.site === query.site)
        .filter((driver) =>
          matchesSearch(
            query.search,
            driver.firstName,
            driver.lastName,
            driver.matricule,
            driver.phone,
            driver.licenseNumber,
            driver.idCardNumber,
          ),
        )
        .sort((a, b) => a.lastName.localeCompare(b.lastName, 'fr'));
      return paginate(items, query.page, query.size);
    });
  }

  override get(id: string): Observable<Driver> {
    return simulate(() => this.find(id));
  }

  override create(input: DriverInput): Observable<Driver> {
    return simulate(() => {
      this.assertNoDuplicate(input);
      const driver: Driver = { ...input, id: crypto.randomUUID(), matricule: this.db.nextDriverMatricule() };
      this.db.drivers.push(driver);
      return driver;
    });
  }

  override update(id: string, input: DriverInput): Observable<Driver> {
    return simulate(() => {
      const driver = this.find(id);
      this.assertNoDuplicate(input, id);
      if (input.status === 'SORTI' && this.db.assignments.some((a) => a.driverId === id && isActive(a))) {
        throw conflict('Ce chauffeur détient encore des équipements : enregistrez leur restitution avant sa sortie (RG-11).');
      }
      Object.assign(driver, input);
      return driver;
    });
  }

  private find(id: string): Driver {
    const driver = this.db.drivers.find((candidate) => candidate.id === id);
    if (!driver) throw notFound('Chauffeur');
    return driver;
  }

  /** EF-09 : doublons sur téléphone, permis et pièce d'identité. */
  private assertNoDuplicate(input: DriverInput, ignoreId?: string): void {
    const others = this.db.drivers.filter((driver) => driver.id !== ignoreId);
    const errors: FieldError[] = [];
    if (others.some((driver) => driver.phone === input.phone)) {
      errors.push({ field: 'phone', message: 'Ce numéro est déjà utilisé par un autre chauffeur.' });
    }
    if (others.some((driver) => driver.licenseNumber === input.licenseNumber)) {
      errors.push({ field: 'licenseNumber', message: 'Ce numéro de permis existe déjà.' });
    }
    if (others.some((driver) => driver.idCardNumber === input.idCardNumber)) {
      errors.push({ field: 'idCardNumber', message: "Ce numéro de pièce d'identité existe déjà." });
    }
    if (errors.length > 0) {
      throw conflict('Doublon potentiel détecté. Vérifiez les champs signalés.', errors);
    }
  }
}
