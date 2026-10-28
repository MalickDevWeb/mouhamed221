import { PageQuery } from '../../shared/models/page';
import { BadgeTone } from '../../shared/ui/status-badge.component';

export const DRIVER_STATUSES = ['ACTIF', 'SUSPENDU', 'SORTI'] as const;
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  ACTIF: 'Actif',
  SUSPENDU: 'Suspendu',
  SORTI: 'Sorti',
};

export const DRIVER_STATUS_TONES: Record<DriverStatus, BadgeTone> = {
  ACTIF: 'success',
  SUSPENDU: 'warning',
  SORTI: 'neutral',
};

/** Valeurs provisoires : le référentiel des sites sera paramétrable (EF-54). */
export const SITES = ['Dakar - Plateau', 'Dakar - Almadies', 'Pikine', 'Rufisque', 'Thiès'] as const;

/** Dossier chauffeur (EF-08). */
export interface Driver {
  id: string;
  matricule: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  phone: string;
  email: string | null;
  address: string;
  site: string;
  hireDate: string;
  status: DriverStatus;
  licenseNumber: string;
  idCardNumber: string;
}

export type DriverInput = Omit<Driver, 'id' | 'matricule'>;

export interface DriverQuery extends PageQuery {
  status?: DriverStatus;
  site?: string;
}

export function driverFullName(driver: Pick<Driver, 'firstName' | 'lastName'>): string {
  return `${driver.firstName} ${driver.lastName.toUpperCase()}`;
}
