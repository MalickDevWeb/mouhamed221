import { Injectable } from '@angular/core';

import { Assignment } from '../features/assignments/assignment.models';
import { Driver } from '../features/drivers/driver.models';
import { Equipment } from '../features/equipment/equipment.models';
import { seedAssignments, seedDrivers, seedEquipment } from './seed';

/** « Base de données » du mode démo, partagée par les repositories en mémoire. */
@Injectable({ providedIn: 'root' })
export class InMemoryDb {
  readonly drivers: Driver[] = seedDrivers();
  readonly equipment: Equipment[] = seedEquipment();
  readonly assignments: Assignment[] = seedAssignments(this.drivers, this.equipment);

  private sequences = { driver: this.drivers.length, equipment: this.equipment.length, receipt: this.assignments.length };

  nextDriverMatricule(): string {
    this.sequences.driver += 1;
    return `CH-${String(this.sequences.driver).padStart(4, '0')}`;
  }

  nextEquipmentCode(): string {
    this.sequences.equipment += 1;
    return `EQ-${String(this.sequences.equipment).padStart(4, '0')}`;
  }

  nextReceiptNumber(): string {
    this.sequences.receipt += 1;
    return `BR-${new Date().getFullYear()}-${String(this.sequences.receipt).padStart(5, '0')}`;
  }
}
