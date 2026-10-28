import { Role } from './roles';

/**
 * Matrice des droits (section 5.2 du cahier des charges).
 * Ajouter une permission = ajouter une ligne ici, sans toucher aux guards ni aux composants.
 */
const PERMISSION_MATRIX = {
  'dashboard.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'drivers.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'drivers.write': ['ADMIN', 'RH'],
  'equipment.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'equipment.write': ['ADMIN', 'TECHNICIEN'],
  'assignments.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'assignments.write': ['ADMIN', 'TECHNICIEN'],
  'onboarding.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'enrollments.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'incidents.read': ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'],
  'users.manage': ['ADMIN'],
  'audit.read': ['ADMIN', 'AUDITEUR'],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSION_MATRIX;

export function isAllowed(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) {
    return false;
  }
  return (PERMISSION_MATRIX[permission] as readonly Role[]).includes(role);
}
