import { PageQuery } from '../../shared/models/page';
import { EquipmentCategory, EquipmentCondition } from '../equipment/equipment.models';

/** Affectation d'un équipement à un chauffeur (EF-23 à EF-26). */
export interface Assignment {
  id: string;
  receiptNumber: string;
  equipmentId: string;
  driverId: string;
  assignedAt: string;
  assignedBy: string;
  conditionOut: EquipmentCondition;
  returnedAt: string | null;
  conditionIn: EquipmentCondition | null;
  notes: string | null;
}

/** Affectation enrichie pour l'affichage (évite N requêtes côté écran). */
export interface AssignmentView extends Assignment {
  driverName: string;
  driverMatricule: string;
  equipmentCode: string;
  equipmentLabel: string;
  equipmentCategory: EquipmentCategory;
}

export interface AssignmentQuery extends PageQuery {
  activeOnly?: boolean;
  driverId?: string;
  equipmentId?: string;
}

export interface NewAssignment {
  equipmentId: string;
  driverId: string;
  conditionOut: EquipmentCondition;
  notes: string | null;
}

export interface AssignmentReturn {
  conditionIn: EquipmentCondition;
  notes: string | null;
}

export function isActive(assignment: Pick<Assignment, 'returnedAt'>): boolean {
  return assignment.returnedAt === null;
}
