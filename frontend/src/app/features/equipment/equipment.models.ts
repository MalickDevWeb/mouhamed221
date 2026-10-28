import { PageQuery } from '../../shared/models/page';
import { BadgeTone } from '../../shared/ui/status-badge.component';

export const EQUIPMENT_CATEGORIES = ['TELEPHONE', 'TABLETTE', 'ORDINATEUR', 'ACCESSOIRE'] as const;
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  TELEPHONE: 'Téléphone',
  TABLETTE: 'Tablette',
  ORDINATEUR: 'Ordinateur',
  ACCESSOIRE: 'Accessoire',
};

/** Cycle de vie de la section 7.4 : PERDU_VOLE et RETIRE sont des états finaux. */
export const EQUIPMENT_STATUSES = ['DISPONIBLE', 'ATTRIBUE', 'EN_REPARATION', 'PERDU_VOLE', 'RETIRE'] as const;
export type EquipmentStatus = (typeof EQUIPMENT_STATUSES)[number];

export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
  DISPONIBLE: 'Disponible',
  ATTRIBUE: 'Attribué',
  EN_REPARATION: 'En réparation',
  PERDU_VOLE: 'Perdu / volé',
  RETIRE: 'Retiré',
};

export const EQUIPMENT_STATUS_TONES: Record<EquipmentStatus, BadgeTone> = {
  DISPONIBLE: 'success',
  ATTRIBUE: 'info',
  EN_REPARATION: 'warning',
  PERDU_VOLE: 'danger',
  RETIRE: 'neutral',
};

export const EQUIPMENT_CONDITIONS = ['NEUF', 'BON', 'USE', 'ENDOMMAGE'] as const;
export type EquipmentCondition = (typeof EQUIPMENT_CONDITIONS)[number];

export const EQUIPMENT_CONDITION_LABELS: Record<EquipmentCondition, string> = {
  NEUF: 'Neuf',
  BON: 'Bon état',
  USE: 'Usé',
  ENDOMMAGE: 'Endommagé',
};

/** Équipement du parc (EF-16). */
export interface Equipment {
  id: string;
  code: string;
  category: EquipmentCategory;
  brand: string;
  model: string;
  serialNumber: string;
  imei: string | null;
  acquisitionDate: string | null;
  warrantyEndDate: string | null;
  condition: EquipmentCondition;
  status: EquipmentStatus;
}

/** Le statut n'est jamais saisi : il évolue par affectation, restitution ou incident. */
export type EquipmentInput = Omit<Equipment, 'id' | 'code' | 'status'>;

export interface EquipmentQuery extends PageQuery {
  category?: EquipmentCategory;
  status?: EquipmentStatus;
}

export function equipmentLabel(equipment: Pick<Equipment, 'brand' | 'model' | 'serialNumber'>): string {
  return `${equipment.brand} ${equipment.model} (${equipment.serialNumber})`;
}
