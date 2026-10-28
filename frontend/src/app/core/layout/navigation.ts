import { Permission } from '../auth/permissions';

export interface NavItem {
  label: string;
  path: string;
  permission: Permission;
}

/** Menu latéral : chaque entrée n'apparaît que si le rôle a la permission. */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Tableau de bord', path: '/dashboard', permission: 'dashboard.read' },
  { label: 'Chauffeurs', path: '/chauffeurs', permission: 'drivers.read' },
  { label: 'Parc informatique', path: '/equipements', permission: 'equipment.read' },
  { label: 'Affectations', path: '/affectations', permission: 'assignments.read' },
  { label: 'Intégration', path: '/integration', permission: 'onboarding.read' },
  { label: 'Enrôlements', path: '/enrolements', permission: 'enrollments.read' },
  { label: 'Incidents', path: '/incidents', permission: 'incidents.read' },
  { label: 'Utilisateurs', path: '/utilisateurs', permission: 'users.manage' },
  { label: "Journal d'audit", path: '/audit', permission: 'audit.read' },
];
