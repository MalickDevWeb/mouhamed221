import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FieldError } from '../../core/http/api-error';
import { EquipmentRepository } from '../../features/equipment/data/equipment.repository';
import { Equipment, EquipmentInput, EquipmentQuery } from '../../features/equipment/equipment.models';
import { matchesSearch, paginate } from '../../shared/data/search';
import { Page } from '../../shared/models/page';
import { InMemoryDb } from '../in-memory-db';
import { conflict, notFound, simulate } from '../simulate';

@Injectable()
export class EquipmentMemoryRepository extends EquipmentRepository {
  private readonly db = inject(InMemoryDb);

  override list(query: EquipmentQuery): Observable<Page<Equipment>> {
    return simulate(() => {
      const items = this.db.equipment
        .filter((item) => !query.category || item.category === query.category)
        .filter((item) => !query.status || item.status === query.status)
        .filter((item) => matchesSearch(query.search, item.code, item.serialNumber, item.imei, item.brand, item.model));
      return paginate(items, query.page, query.size);
    });
  }

  override get(id: string): Observable<Equipment> {
    return simulate(() => this.find(id));
  }

  override create(input: EquipmentInput): Observable<Equipment> {
    return simulate(() => {
      this.assertUnique(input);
      const equipment: Equipment = {
        ...input,
        id: crypto.randomUUID(),
        code: this.db.nextEquipmentCode(),
        status: 'DISPONIBLE',
      };
      this.db.equipment.push(equipment);
      return equipment;
    });
  }

  override update(id: string, input: EquipmentInput): Observable<Equipment> {
    return simulate(() => {
      const equipment = this.find(id);
      this.assertUnique(input, id);
      Object.assign(equipment, input);
      return equipment;
    });
  }

  private find(id: string): Equipment {
    const equipment = this.db.equipment.find((candidate) => candidate.id === id);
    if (!equipment) throw notFound('Équipement');
    return equipment;
  }

  /** RG-01 : numéro de série et IMEI uniques. */
  private assertUnique(input: EquipmentInput, ignoreId?: string): void {
    const others = this.db.equipment.filter((item) => item.id !== ignoreId);
    const errors: FieldError[] = [];
    if (others.some((item) => item.serialNumber === input.serialNumber)) {
      errors.push({ field: 'serialNumber', message: 'Ce numéro de série existe déjà.' });
    }
    if (input.imei && others.some((item) => item.imei === input.imei)) {
      errors.push({ field: 'imei', message: 'Cet IMEI existe déjà.' });
    }
    if (errors.length > 0) {
      throw conflict('Identifiant déjà enregistré (RG-01).', errors);
    }
  }
}
