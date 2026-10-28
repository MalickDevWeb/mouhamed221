import { DriverStatus } from '../../drivers/driver.models';
import { EquipmentCategory, EquipmentCondition, EquipmentStatus } from '../../equipment/equipment.models';

/**
 * Règles d'affectation, sans dépendance Angular : testables seules et
 * partagées par l'écran (retour immédiat) et l'API simulée.
 */
export type AssignmentViolation =
  | 'EQUIPMENT_NOT_AVAILABLE'
  | 'EQUIPMENT_ALREADY_ASSIGNED'
  | 'DRIVER_NOT_ACTIVE'
  | 'DRIVER_ALREADY_HAS_PHONE';

export const VIOLATION_MESSAGES: Record<AssignmentViolation, string> = {
  EQUIPMENT_NOT_AVAILABLE: 'Seul un équipement disponible peut être affecté (RG-03).',
  EQUIPMENT_ALREADY_ASSIGNED: 'Cet équipement a déjà une affectation active (RG-02).',
  DRIVER_NOT_ACTIVE: 'Seul un chauffeur actif peut recevoir un équipement (RG-03).',
  DRIVER_ALREADY_HAS_PHONE: 'Ce chauffeur détient déjà un téléphone professionnel actif (RG-05).',
};

export interface AssignmentContext {
  equipment: { status: EquipmentStatus; category: EquipmentCategory };
  equipmentHasActiveAssignment: boolean;
  driver: { status: DriverStatus };
  /** Nombre de téléphones actuellement détenus par le chauffeur. */
  driverActivePhones: number;
}

export function checkAssignment(context: AssignmentContext): AssignmentViolation[] {
  const violations: AssignmentViolation[] = [];
  if (context.equipmentHasActiveAssignment) {
    violations.push('EQUIPMENT_ALREADY_ASSIGNED');
  } else if (context.equipment.status !== 'DISPONIBLE') {
    violations.push('EQUIPMENT_NOT_AVAILABLE');
  }
  if (context.driver.status !== 'ACTIF') {
    violations.push('DRIVER_NOT_ACTIVE');
  }
  if (context.equipment.category === 'TELEPHONE' && context.driverActivePhones > 0) {
    violations.push('DRIVER_ALREADY_HAS_PHONE');
  }
  return violations;
}

/** RG-12 : un équipement rendu endommagé part en réparation, jamais en disponible. */
export function statusAfterReturn(condition: EquipmentCondition): EquipmentStatus {
  return condition === 'ENDOMMAGE' ? 'EN_REPARATION' : 'DISPONIBLE';
}
