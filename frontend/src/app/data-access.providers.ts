import { Provider, Type } from '@angular/core';

import { AuthGateway } from './core/auth/auth.gateway';
import { HttpAuthGateway } from './core/auth/http-auth.gateway';
import { AssignmentHttpRepository } from './features/assignments/data/assignment.http.repository';
import { AssignmentRepository } from './features/assignments/data/assignment.repository';
import { DashboardHttpRepository, DashboardRepository } from './features/dashboard/data/dashboard.repository';
import { DriverHttpRepository } from './features/drivers/data/driver.http.repository';
import { DriverRepository } from './features/drivers/data/driver.repository';
import { EquipmentHttpRepository } from './features/equipment/data/equipment.http.repository';
import { EquipmentRepository } from './features/equipment/data/equipment.repository';
import { AssignmentMemoryRepository } from './mock/repositories/assignment.memory.repository';
import { DashboardMemoryRepository } from './mock/repositories/dashboard.memory.repository';
import { DriverMemoryRepository } from './mock/repositories/driver.memory.repository';
import { EquipmentMemoryRepository } from './mock/repositories/equipment.memory.repository';
import { MemoryAuthGateway } from './mock/repositories/memory-auth.gateway';

/** Chaque port (abstraction) avec son implémentation HTTP et sa simulation. */
const BINDINGS: readonly { port: abstract new () => unknown; http: Type<unknown>; memory: Type<unknown> }[] = [
  { port: AuthGateway, http: HttpAuthGateway, memory: MemoryAuthGateway },
  { port: DriverRepository, http: DriverHttpRepository, memory: DriverMemoryRepository },
  { port: EquipmentRepository, http: EquipmentHttpRepository, memory: EquipmentMemoryRepository },
  { port: AssignmentRepository, http: AssignmentHttpRepository, memory: AssignmentMemoryRepository },
  { port: DashboardRepository, http: DashboardHttpRepository, memory: DashboardMemoryRepository },
];

/**
 * Racine de composition : seul endroit qui choisit les implémentations.
 * Passer au vrai backend = mettre useMockApi à false, sans toucher aux écrans.
 */
export function provideDataAccess(useMockApi: boolean): Provider[] {
  return BINDINGS.map(({ port, http, memory }) => ({ provide: port, useClass: useMockApi ? memory : http }));
}
