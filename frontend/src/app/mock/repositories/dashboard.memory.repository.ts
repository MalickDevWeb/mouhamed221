import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { isActive } from '../../features/assignments/assignment.models';
import { DashboardRepository } from '../../features/dashboard/data/dashboard.repository';
import { DashboardSummary } from '../../features/dashboard/dashboard.models';
import { DRIVER_STATUSES, DriverStatus } from '../../features/drivers/driver.models';
import { EQUIPMENT_STATUSES, EquipmentStatus } from '../../features/equipment/equipment.models';
import { InMemoryDb } from '../in-memory-db';
import { simulate } from '../simulate';

function countBy<K extends string>(keys: readonly K[], values: readonly K[]): Record<K, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, number>;
  for (const value of values) {
    counts[value] += 1;
  }
  return counts;
}

@Injectable()
export class DashboardMemoryRepository extends DashboardRepository {
  private readonly db = inject(InMemoryDb);

  override summary(): Observable<DashboardSummary> {
    return simulate(() => {
      const equipmentByStatus = countBy<EquipmentStatus>(EQUIPMENT_STATUSES, this.db.equipment.map((e) => e.status));
      const inService = this.db.equipment.length - equipmentByStatus.RETIRE - equipmentByStatus.PERDU_VOLE;
      return {
        driversByStatus: countBy<DriverStatus>(DRIVER_STATUSES, this.db.drivers.map((d) => d.status)),
        equipmentByStatus,
        activeAssignments: this.db.assignments.filter(isActive).length,
        utilizationRate: inService > 0 ? equipmentByStatus.ATTRIBUE / inService : 0,
      };
    });
  }
}
