export const ROLES = ['ADMIN', 'RH', 'TECHNICIEN', 'SUPERVISEUR', 'AUDITEUR'] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Administrateur',
  RH: 'Gestionnaire RH',
  TECHNICIEN: 'Technicien IT',
  SUPERVISEUR: 'Superviseur',
  AUDITEUR: 'Auditeur',
};
