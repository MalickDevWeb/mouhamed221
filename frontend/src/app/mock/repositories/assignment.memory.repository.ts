import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionStore } from '../../core/auth/session.store';
import {
  Assignment,
  AssignmentQuery,
  AssignmentReturn,
  AssignmentView,
  NewAssignment,
  isActive,
} from '../../features/assignments/assignment.models';
import { AssignmentRepository } from '../../features/assignments/data/assignment.repository';
import { VIOLATION_MESSAGES, checkAssignment, statusAfterReturn } from '../../features/assignments/domain/assignment.policy';
import { driverFullName } from '../../features/drivers/driver.models';
import { equipmentLabel } from '../../features/equipment/equipment.models';
import { matchesSearch, paginate } from '../../shared/data/search';
import { Page } from '../../shared/models/page';
import { InMemoryDb } from '../in-memory-db';
import { conflict, notFound, simulate, today } from '../simulate';

/** Simule l'API : applique les mêmes règles que le backend (RG-02, RG-03, RG-05, RG-12). */
@Injectable()
export class AssignmentMemoryRepository extends AssignmentRepository {
  private readonly db = inject(InMemoryDb);
  private readonly session = inject(SessionStore);

  override list(query: AssignmentQuery): Observable<Page<AssignmentView>> {
    return simulate(() => {
      const items = this.db.assignments
        .filter((a) => !query.activeOnly || isActive(a))
        .filter((a) => !query.driverId || a.driverId === query.driverId)
        .filter((a) => !query.equipmentId || a.equipmentId === query.equipmentId)
        .map((a) => this.toView(a))
        .filter((view) =>
          matchesSearch(query.search, view.receiptNumber, view.driverName, view.driverMatricule, view.equipmentCode, view.equipmentLabel),
        )
        .sort((a, b) => Number(isActive(b)) - Number(isActive(a)) || b.assignedAt.localeCompare(a.assignedAt));
      return paginate(items, query.page, query.size);
    });
  }

  override create(input: NewAssignment): Observable<Assignment> {
    return simulate(() => {
      const equipment = this.db.equipment.find((item) => item.id === input.equipmentId);
      const driver = this.db.drivers.find((item) => item.id === input.driverId);
      if (!equipment) throw notFound('Équipement');
      if (!driver) throw notFound('Chauffeur');

      const active = this.db.assignments.filter(isActive).map((a) => this.toView(a));
      const violations = checkAssignment({
        equipment,
        driver,
        equipmentHasActiveAssignment: active.some((a) => a.equipmentId === equipment.id),
        driverActivePhones: active.filter((a) => a.driverId === driver.id && a.equipmentCategory === 'TELEPHONE').length,
      });
      if (violations.length > 0) {
        throw conflict(violations.map((violation) => VIOLATION_MESSAGES[violation]).join(' '));
      }

      const assignment: Assignment = {
        id: crypto.randomUUID(),
        receiptNumber: this.db.nextReceiptNumber(),
        equipmentId: equipment.id,
        driverId: driver.id,
        assignedAt: today(),
        assignedBy: this.session.user()?.fullName ?? 'Inconnu',
        conditionOut: input.conditionOut,
        returnedAt: null,
        conditionIn: null,
        notes: input.notes,
      };
      this.db.assignments.push(assignment);
      equipment.status = 'ATTRIBUE';
      return assignment;
    });
  }

  override returnEquipment(id: string, input: AssignmentReturn): Observable<Assignment> {
    return simulate(() => {
      const assignment = this.db.assignments.find((item) => item.id === id);
      if (!assignment) throw notFound('Affectation');
      if (!isActive(assignment)) throw conflict('Cette affectation est déjà clôturée.');

      assignment.returnedAt = today();
      assignment.conditionIn = input.conditionIn;
      assignment.notes = [assignment.notes, input.notes].filter(Boolean).join(' — ') || null;

      const equipment = this.db.equipment.find((item) => item.id === assignment.equipmentId);
      if (equipment) {
        equipment.condition = input.conditionIn;
        equipment.status = statusAfterReturn(input.conditionIn);
      }
      return assignment;
    });
  }

  private toView(assignment: Assignment): AssignmentView {
    const driver = this.db.drivers.find((item) => item.id === assignment.driverId);
    const equipment = this.db.equipment.find((item) => item.id === assignment.equipmentId);
    return {
      ...assignment,
      driverName: driver ? driverFullName(driver) : '—',
      driverMatricule: driver?.matricule ?? '—',
      equipmentCode: equipment?.code ?? '—',
      equipmentLabel: equipment ? equipmentLabel(equipment) : '—',
      equipmentCategory: equipment?.category ?? 'ACCESSOIRE',
    };
  }
}
