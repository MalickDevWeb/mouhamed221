import { DriverStatus } from '../drivers/driver.models';
import { EquipmentStatus } from '../equipment/equipment.models';

/** Indicateurs de la section 12.3 disponibles à ce stade du projet. */
export interface DashboardSummary {
  driversByStatus: Record<DriverStatus, number>;
  equipmentByStatus: Record<EquipmentStatus, number>;
  activeAssignments: number;
  /** Attribués / (total − retirés − perdus), entre 0 et 1. */
  utilizationRate: number;
}
