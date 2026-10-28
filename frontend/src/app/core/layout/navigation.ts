export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
  roles?: readonly string[];
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

/** Groupes de navigation KAI d'après le prototype officiel */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    heading: 'Vue générale',
    items: [
      { label: 'Tableau de bord', path: '/dashboard', icon: '⌂' },
      { label: 'Véhicules', path: '/vehicules', icon: '▰' },
      { label: 'Chauffeurs', path: '/chauffeurs', icon: '♙' },
      { label: 'Équipements', path: '/equipements', icon: '▣' },
      { label: 'Cartes SIM', path: '/sim', icon: '▤' },
      { label: 'Affectations', path: '/affectations', icon: '⇄' },
    ],
  },
  {
    heading: 'Suivi opérationnel',
    items: [
      { label: 'Maintenance', path: '/maintenance', icon: '⚒' },
      { label: 'Intégrations', path: '/integration', icon: '✓' },
      { label: 'Enrôlements', path: '/enrolements', icon: '↗' },
      { label: 'Incidents', path: '/incidents', icon: '⚑', badge: '4' },
      { label: 'Documents chauffeurs', path: '/documents', icon: '▤' },
      { label: 'Restitutions', path: '/restitutions', icon: '↩' },
      { label: 'Historique des affectations', path: '/historique', icon: '≡' },
    ],
  },
  {
    heading: 'Administration',
    items: [
      { label: 'Analytics', path: '/analytics', icon: '▥' },
      { label: 'Gestion des accès', path: '/acces', icon: '♧' },
      { label: 'Journal d’audit', path: '/audit', icon: '☷' },
      { label: 'Import / Export', path: '/importexport', icon: '⇅' },
      { label: 'Mon profil & sécurité', path: '/profil', icon: '♙' },
      { label: 'Paramètres', path: '/parametres', icon: '⚙' },
    ],
  },
];
