import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface DatasetModule {
  title: string;
  desc: string;
  button: string;
  stats: [string, string][];
  cols: string[];
  rows: string[][];
  formFields?: { name: string; type: 'text' | 'date' | 'email' | 'select' | 'textarea'; options?: string[] }[];
}

const DATASETS: Record<string, DatasetModule> = {
  vehicules: {
    title: 'Parc véhicules',
    desc: 'Suivez les véhicules, les disponibilités et les affectations en un seul endroit.',
    button: 'Ajouter un véhicule',
    stats: [['96', 'Véhicules enregistrés'], ['81', 'Opérationnels'], ['9', 'En maintenance']],
    cols: ['Référence', 'Véhicule', 'Immatriculation', 'Site', 'Conducteur', 'Statut'],
    rows: [
      ['VH-0108', 'Toyota Hilux', 'DK-4821-AB', 'Dakar', 'Mamadou Ndiaye', 'Attribué'],
      ['VH-0107', 'Renault Duster', 'DK-3910-CD', 'Diamniadio', 'Aminata Diop', 'Attribué'],
      ['VH-0106', 'Toyota Corolla', 'DK-1288-EF', 'Dakar', '—', 'Disponible'],
      ['VH-0105', 'Mitsubishi L200', 'TH-2024-GH', 'Thiès', '—', 'En maintenance'],
      ['VH-0104', 'Hyundai Tucson', 'DK-8730-JK', 'Rufisque', 'Fatou Sow', 'Attribué'],
      ['VH-0103', 'Ford Ranger', 'DK-9284-LM', 'Dakar', '—', 'Disponible'],
    ],
  },
  chauffeurs: {
    title: 'Gestion des chauffeurs',
    desc: 'Consultez les profils, les dossiers et les statuts de vos chauffeurs.',
    button: 'Nouveau chauffeur',
    stats: [['136', 'Dossiers enregistrés'], ['128', 'Chauffeurs actifs'], ['5', 'Dossiers à vérifier']],
    cols: ['Référence', 'Chauffeur', 'Site', 'Date d’entrée', 'Véhicule', 'Statut'],
    rows: [
      ['CH-0024', 'Mamadou Ndiaye', 'Dakar', '12/03/2024', 'Toyota Hilux', 'Actif'],
      ['CH-0023', 'Aminata Diop', 'Diamniadio', '17/06/2024', 'Renault Duster', 'Actif'],
      ['CH-0022', 'Ibrahima Fall', 'Dakar', '08/01/2025', '—', 'À vérifier'],
      ['CH-0021', 'Fatou Sow', 'Thiès', '22/09/2024', 'Hyundai Tucson', 'Actif'],
      ['CH-0020', 'Cheikh Ba', 'Rufisque', '14/11/2023', '—', 'Inactif'],
      ['CH-0019', 'Awa Sarr', 'Dakar', '02/02/2025', 'Toyota Corolla', 'Actif'],
    ],
  },
  equipements: {
    title: 'Parc informatique',
    desc: 'Inventaire des téléphones, ordinateurs et accessoires informatiques.',
    button: 'Nouvel équipement',
    stats: [['214', 'Équipements suivis'], ['142', 'Attribués'], ['38', 'Disponibles']],
    cols: ['Référence', 'Équipement', 'IMEI / série', 'Type', 'Détenteur', 'Statut'],
    rows: [
      ['EQ-0214', 'Samsung Galaxy A54', '3569•••••218', 'Téléphone', 'Mamadou Ndiaye', 'Attribué'],
      ['EQ-0213', 'iPhone 13', '3528•••••512', 'Téléphone', 'Aminata Diop', 'Attribué'],
      ['EQ-0212', 'Dell Latitude 5440', 'DL-5440-071', 'Ordinateur', '—', 'Disponible'],
      ['EQ-0211', 'Samsung Galaxy A34', '3591•••••884', 'Téléphone', '—', 'En réparation'],
      ['EQ-0210', 'Chargeur USB-C', 'ACC-0984', 'Accessoire', 'Ibrahima Fall', 'Attribué'],
      ['EQ-0209', 'Dell Latitude 5430', 'DL-5430-029', 'Ordinateur', 'Fatou Sow', 'Attribué'],
    ],
  },
  sim: {
    title: 'Gestion des cartes SIM',
    desc: 'Suivez les numéros, les ICCID, les opérateurs et les équipements associés.',
    button: 'Ajouter une carte SIM',
    stats: [['84', 'Cartes SIM'], ['69', 'Attribuées'], ['8', 'Disponibles']],
    cols: ['Référence', 'Numéro', 'ICCID', 'Opérateur', 'Équipement', 'Statut'],
    rows: [
      ['SIM-0084', '77 123 45 67', 'OR-8944 0012', 'Orange', 'EQ-0214', 'Attribuée'],
      ['SIM-0083', '76 234 56 78', 'FR-8944 0027', 'Free', 'EQ-0213', 'Attribuée'],
      ['SIM-0082', '78 345 67 89', 'OR-8944 0033', 'Orange', '—', 'Disponible'],
      ['SIM-0081', '70 456 78 90', 'EX-8944 0049', 'Expresso', '—', 'Suspendue'],
      ['SIM-0080', '77 567 89 01', 'OR-8944 0062', 'Orange', 'EQ-0210', 'Attribuée'],
    ],
  },
  affectations: {
    title: 'Affectations & restitutions',
    desc: 'Gérez les remises, les états du matériel et les retours.',
    button: 'Créer une affectation',
    stats: [['142', 'Affectations actives'], ['12', 'À restituer'], ['38', 'Disponibles']],
    cols: ['Référence', 'Bénéficiaire', 'Matériel', 'Date', 'Responsable', 'Statut'],
    rows: [
      ['AF-0142', 'Mamadou Ndiaye', 'Galaxy A54 · EQ-0214', '20/10/2026', 'M. Camara', 'En cours'],
      ['AF-0141', 'Aminata Diop', 'Renault Duster · VH-0107', '18/10/2026', 'A. Diallo', 'En cours'],
      ['AF-0140', 'Ibrahima Fall', 'Chargeur USB-C · EQ-0210', '15/10/2026', 'M. Camara', 'À restituer'],
      ['AF-0139', 'Fatou Sow', 'Dell Latitude · EQ-0209', '12/10/2026', 'A. Diallo', 'En cours'],
      ['AF-0138', 'Cheikh Ba', 'Hyundai Tucson · VH-0104', '01/10/2026', 'M. Camara', 'Restitué'],
    ],
  },
  maintenance: {
    title: 'Maintenance & interventions',
    desc: 'Planifiez les interventions et suivez les équipements immobilisés.',
    button: 'Planifier une intervention',
    stats: [['12', 'Interventions en cours'], ['4', 'Priorité haute'], ['9', 'À planifier']],
    cols: ['Référence', 'Actif concerné', 'Intervention', 'Responsable', 'Échéance', 'Statut'],
    rows: [
      ['INT-0092', 'VH-0105 · Mitsubishi', 'Entretien périodique', 'M. Sarr', '29/10/2026', 'Planifiée'],
      ['INT-0091', 'EQ-0211 · Galaxy A34', 'Remplacement batterie', 'K. Faye', '28/10/2026', 'En cours'],
      ['INT-0090', 'VH-0102 · Ford Ranger', 'Contrôle pneumatiques', 'M. Sarr', '30/10/2026', 'À planifier'],
      ['INT-0089', 'EQ-0209 · Dell Latitude', 'Diagnostic réseau', 'K. Faye', '27/10/2026', 'Terminée'],
    ],
  },
  integration: {
    title: 'Dossiers d’intégration',
    desc: 'Suivez les étapes requises pour rendre un chauffeur opérationnel.',
    button: 'Créer un dossier',
    stats: [['14', 'Dossiers ouverts'], ['8', 'En cours'], ['6', 'À compléter']],
    cols: ['Référence', 'Chauffeur', 'Parcours', 'Progression', 'Responsable', 'Statut'],
    rows: [
      ['INTG-0038', 'Ibrahima Fall', 'Dossier chauffeur', '4 / 6 étapes', 'A. Diallo', 'En attente'],
      ['INTG-0037', 'Aminata Diop', 'Matériel & accès', '6 / 6 étapes', 'M. Camara', 'Terminé'],
      ['INTG-0036', 'Cheikh Ba', 'Dossier chauffeur', '3 / 6 étapes', 'A. Diallo', 'À compléter'],
      ['INTG-0035', 'Fatou Sow', 'Matériel & accès', '5 / 6 étapes', 'M. Camara', 'En cours'],
    ],
  },
  enrolements: {
    title: 'Demandes d’enrôlement',
    desc: 'Suivez les demandes de configuration, l’affectation des techniciens et les validations.',
    button: 'Nouvelle demande',
    stats: [['18', 'Demandes ce mois'], ['3', 'En attente'], ['11', 'Terminées']],
    cols: ['Référence', 'Chauffeur', 'Type de demande', 'Date', 'Technicien', 'Statut'],
    rows: [
      ['ENR-0075', 'Mamadou Ndiaye', 'Enrôlement appareil', '21/10/2026', 'K. Faye', 'À valider'],
      ['ENR-0074', 'Aminata Diop', 'Activation compte', '20/10/2026', 'K. Faye', 'Terminé'],
      ['ENR-0073', 'Ibrahima Fall', 'Configuration mobile', '19/10/2026', 'M. Camara', 'En attente'],
      ['ENR-0072', 'Fatou Sow', 'Enrôlement appareil', '17/10/2026', 'K. Faye', 'Terminé'],
    ],
  },
  incidents: {
    title: 'Incidents & signalements',
    desc: 'Centralisez les incidents, priorités, responsables et actions correctives.',
    button: 'Déclarer un incident',
    stats: [['12', 'Incidents ce mois'], ['4', 'À traiter'], ['2', 'Priorité haute']],
    cols: ['Référence', 'Actif concerné', 'Description', 'Priorité', 'Responsable', 'Statut'],
    rows: [
      ['INC-0052', 'EQ-0211 · Galaxy A34', 'Batterie défectueuse', 'Haute', 'K. Faye', 'En cours'],
      ['INC-0051', 'VH-0105 · Mitsubishi', 'Entretien périodique', 'Moyenne', 'M. Sarr', 'Planifié'],
      ['INC-0050', 'EQ-0209 · Dell Latitude', 'Problème de connexion', 'Moyenne', 'K. Faye', 'Résolu'],
      ['INC-0049', 'SIM-0081 · Expresso', 'Carte SIM suspendue', 'Haute', 'M. Camara', 'À traiter'],
    ],
  },
  acces: {
    title: 'Gestion des accès',
    desc: 'Administrez les comptes, rôles et droits d’accès à la plateforme.',
    button: 'Inviter un utilisateur',
    stats: [['24', 'Utilisateurs'], ['5', 'Rôles configurés'], ['2', 'Accès à vérifier']],
    cols: ['Référence', 'Utilisateur', 'Adresse e-mail', 'Rôle', 'Dernière connexion', 'Statut'],
    rows: [
      ['USR-001', 'Aminata Diallo', 'a.diallo@kai.demo', 'Administrateur', 'Aujourd’hui · 17:42', 'Actif'],
      ['USR-002', 'Moussa Camara', 'm.camara@kai.demo', 'Gestionnaire de parc', 'Aujourd’hui · 16:13', 'Actif'],
      ['USR-003', 'Khadija Faye', 'k.faye@kai.demo', 'Technicien', 'Aujourd’hui · 15:27', 'Actif'],
      ['USR-004', 'Ousmane Kane', 'o.kane@kai.demo', 'Superviseur', '21/10/2026', 'Suspendu'],
    ],
  },
  parametres: {
    title: 'Paramètres',
    desc: 'Personnalisez les informations de votre organisation et les préférences de suivi.',
    button: 'Enregistrer les paramètres',
    stats: [['4', 'Sites configurés'], ['3', 'Opérateurs SIM'], ['6', 'Catégories d’actifs']],
    cols: ['Référence', 'Paramètre', 'Description', 'Portée', 'Modifié le', 'Statut'],
    rows: [
      ['CFG-001', 'Informations entreprise', 'Nom et coordonnées de la structure', 'Global', '28/10/2026', 'Actif'],
      ['CFG-002', 'Sites', 'Dakar, Diamniadio, Thiès, Rufisque', 'Référentiel', '27/10/2026', 'Actif'],
      ['CFG-003', 'Opérateurs SIM', 'Orange, Free, Expresso', 'Référentiel', '27/10/2026', 'Actif'],
      ['CFG-004', 'Notifications', 'Alertes et rappels opérationnels', 'Préférences', '26/10/2026', 'Actif'],
    ],
  },
  documents: {
    title: 'Documents chauffeurs',
    desc: 'Suivez les pièces justificatives, leurs dates d’expiration et leur validation.',
    button: 'Ajouter un document',
    stats: [['24', 'Documents référencés'], ['19', 'Documents validés'], ['3', 'À renouveler']],
    cols: ['Référence', 'Chauffeur', 'Type de document', 'Nom du fichier', 'Date d’expiration', 'Statut'],
    rows: [
      ['DOC-0024', 'Mamadou Ndiaye', 'Permis de conduire', 'permis_CH0024.pdf', '12/08/2027', 'Validé'],
      ['DOC-0023', 'Aminata Diop', 'Pièce d’identité', 'identite_CH0023.pdf', '08/04/2028', 'Validé'],
      ['DOC-0022', 'Ibrahima Fall', 'Visite médicale', 'visite_CH0022.pdf', '30/10/2026', 'À renouveler'],
      ['DOC-0021', 'Fatou Sow', 'Permis de conduire', 'permis_CH0021.pdf', '14/06/2027', 'Validé'],
    ],
  },
  restitutions: {
    title: 'Restitutions de matériel',
    desc: 'Enregistrez les retours, vérifiez l’état du matériel et clôturez les remises.',
    button: 'Enregistrer une restitution',
    stats: [['12', 'Retours attendus'], ['3', 'À contrôler'], ['9', 'Retours clôturés']],
    cols: ['Référence', 'Bénéficiaire', 'Matériel', 'Date de retour', 'État au retour', 'Statut'],
    rows: [
      ['RET-0018', 'Ibrahima Fall', 'Chargeur USB-C · EQ-0210', '28/10/2026', 'À contrôler', 'À restituer'],
      ['RET-0017', 'Cheikh Ba', 'Hyundai Tucson · VH-0104', '01/10/2026', 'Bon état', 'Restitué'],
      ['RET-0016', 'Awa Sarr', 'iPhone 12 · EQ-0202', '25/09/2026', 'Bon état', 'Restitué'],
    ],
  },
  historique: {
    title: 'Historique des affectations',
    desc: 'Consultez les mouvements, les remises, les restitutions et leur historique.',
    button: 'Exporter l’historique',
    stats: [['156', 'Mouvements enregistrés'], ['12', 'Ce mois-ci'], ['9', 'Restitutions clôturées']],
    cols: ['Référence', 'Mouvement', 'Bénéficiaire', 'Matériel', 'Date', 'Résultat'],
    rows: [
      ['HIST-0012', 'Remise', 'Mamadou Ndiaye', 'Samsung Galaxy A54 · EQ-0214', '20/10/2026', 'Terminé'],
      ['HIST-0011', 'Restitution', 'Cheikh Ba', 'Hyundai Tucson · VH-0104', '01/10/2026', 'Terminé'],
      ['HIST-0010', 'Remise', 'Fatou Sow', 'Dell Latitude · EQ-0209', '12/10/2026', 'Terminé'],
    ],
  },
  audit: {
    title: 'Journal d’audit',
    desc: 'Tracez les créations, modifications, validations, imports et suppressions effectués dans la maquette.',
    button: 'Exporter le journal',
    stats: [['24', 'Événements récents'], ['5', 'Modules concernés'], ['0', 'Échec de démonstration']],
    cols: ['Référence', 'Date & heure', 'Utilisateur', 'Action', 'Module', 'Résultat'],
    rows: [
      ['AUD-0024', '28/10/2026 17:42', 'Aminata Diallo', 'Validation d’affectation', 'Affectations', 'Succès'],
      ['AUD-0023', '28/10/2026 16:13', 'Moussa Camara', 'Modification équipement EQ-0214', 'Équipements', 'Succès'],
      ['AUD-0022', '28/10/2026 15:27', 'Khadija Faye', 'Clôture incident INC-0050', 'Incidents', 'Succès'],
    ],
  },
};

@Component({
  selector: 'app-kai-table-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './kai-table.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KaiTablePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly moduleKey = signal<string>('vehicules');
  protected readonly searchTerm = signal<string>('');
  protected readonly statusFilter = signal<string>('');

  protected readonly detailModalOpen = signal(false);
  protected readonly selectedRow = signal<string[] | null>(null);

  protected readonly createModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly formValues = signal<string[]>([]);
  protected readonly currentEditIndex = signal<number | null>(null);

  protected readonly advancedFilterOpen = signal(false);
  protected readonly selectedSite = signal('Tous les sites');
  protected readonly selectedPeriod = signal('Toutes les périodes');

  protected readonly toastMessage = signal<string>('');
  protected readonly toastVisible = signal(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  // Import / Export signals
  protected readonly exportSelectedModule = signal('vehicules');
  protected readonly importTargetModule = signal('vehicules');
  protected readonly importFeedback = signal('Sélectionnez un fichier puis cliquez sur « Analyser le fichier ».');
  protected readonly importFileReady = signal(false);
  protected parsedImportRows: string[][] = [];

  // Analytics signals
  protected readonly analyticsPeriod = signal<'monthly' | 'annual'>('monthly');

  // Settings form signals
  protected readonly orgName = signal('KAI — Gestion des opérations');
  protected readonly orgTimezone = signal('Africa/Dakar (GMT)');
  protected readonly orgCurrency = signal('FCFA (XOF)');
  protected readonly orgLanguage = signal('Français');
  protected readonly orgSite = signal('Dakar');
  protected readonly orgNotifications = signal('Alertes activées');

  // Profile form signals
  protected readonly profileName = signal('Aminata Diallo');
  protected readonly profileEmail = signal('a.diallo@kai.demo');
  protected readonly profileRole = signal('Administratrice');
  protected readonly profilePhone = signal('+221 77 000 00 00');
  protected readonly profileNewPassword = signal('');
  protected readonly profileConfirmPassword = signal('');

  constructor() {
    this.route.data.subscribe((d) => {
      const key = (d['moduleKey'] as string) || this.route.snapshot.url[0]?.path || 'vehicules';
      this.moduleKey.set(key);
      this.searchTerm.set('');
      this.statusFilter.set('');
    });
  }

  protected readonly currentModule = computed(() => {
    return DATASETS[this.moduleKey()] || DATASETS['vehicules'];
  });

  protected readonly availableModules = computed(() => {
    return Object.keys(DATASETS).filter((k) => !['audit', 'historique', 'parametres'].includes(k));
  });

  protected readonly statuses = computed(() => {
    const rows = this.currentModule().rows;
    return Array.from(new Set(rows.map((r) => r[r.length - 1])));
  });

  protected readonly filteredRows = computed(() => {
    const mod = this.currentModule();
    const search = this.searchTerm().toLowerCase().trim();
    const status = this.statusFilter();
    const site = this.selectedSite();

    return mod.rows.filter((r) => {
      const matchesSearch = !search || r.join(' ').toLowerCase().includes(search);
      const matchesStatus = !status || r[r.length - 1] === status;
      const matchesSite = site === 'Tous les sites' || r.includes(site);
      return matchesSearch && matchesStatus && matchesSite;
    });
  });

  protected showToast(msg: string): void {
    this.toastMessage.set(msg);
    this.toastVisible.set(true);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastVisible.set(false);
    }, 2800);
  }

  protected getInitials(val: string): string {
    return (val || 'K')
      .split(/[ .-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join('')
      .toUpperCase();
  }

  protected getPillClass(val: string): string {
    const v = String(val || '').toLowerCase();
    if (['actif', 'attribué', 'attribuée', 'disponible', 'en cours', 'terminé', 'terminée', 'résolu', 'restitué', 'validé', 'succès', 'opérationnels'].includes(v)) {
      return 'green';
    }
    if (['à vérifier', 'en attente', 'à compléter', 'à restituer', 'moyenne', 'planifiée', 'planifié', 'à valider', 'à planifier', 'à renouveler'].includes(v)) {
      return 'amber';
    }
    if (['inactif', 'suspendue', 'suspendu', 'haute', 'à traiter', 'en réparation', 'rejeté', 'expiré', 'critique'].includes(v)) {
      return 'red';
    }
    return 'blue';
  }

  protected openDetail(row: string[]): void {
    this.selectedRow.set(row);
    this.detailModalOpen.set(true);
  }

  protected closeDetail(): void {
    this.detailModalOpen.set(false);
  }

  protected openCreate(): void {
    const mod = this.currentModule();
    this.isEditing.set(false);
    this.currentEditIndex.set(null);
    this.formValues.set(new Array(mod.cols.length).fill(''));
    this.createModalOpen.set(true);
  }

  protected openEdit(row: string[]): void {
    const mod = this.currentModule();
    const idx = mod.rows.indexOf(row);
    this.isEditing.set(true);
    this.currentEditIndex.set(idx >= 0 ? idx : null);
    this.formValues.set([...row]);
    this.createModalOpen.set(true);
  }

  protected closeCreate(): void {
    this.createModalOpen.set(false);
  }

  protected saveForm(): void {
    const mod = this.currentModule();
    const vals = [...this.formValues()];
    const key = this.moduleKey();

    if (this.isEditing()) {
      const idx = this.currentEditIndex();
      if (idx !== null && idx >= 0 && idx < mod.rows.length) {
        mod.rows[idx] = vals;
        this.logAudit('Modification', key, vals[0]);
        this.showToast(`Enregistrement ${vals[0]} mis à jour.`);
      }
    } else {
      const prefix = key === 'vehicules' ? 'VH'
        : key === 'chauffeurs' ? 'CH'
        : key === 'equipements' ? 'EQ'
        : key === 'sim' ? 'SIM'
        : key === 'affectations' ? 'AF'
        : key === 'maintenance' ? 'INT'
        : key === 'incidents' ? 'INC'
        : key === 'integration' ? 'INTG'
        : key === 'enrolements' ? 'ENR'
        : key === 'documents' ? 'DOC'
        : key === 'restitutions' ? 'RET'
        : key === 'acces' ? 'USR'
        : key.toUpperCase().slice(0, 3);

      vals[0] = `${prefix}-${String(Math.floor(1000 + Math.random() * 9000))}`;
      mod.rows.unshift(vals);
      this.logAudit('Création', key, vals[0]);
      this.showToast(`Nouvel enregistrement ${vals[0]} ajouté.`);
    }
    this.createModalOpen.set(false);
  }

  protected deleteRow(row: string[], event: Event): void {
    event.stopPropagation();
    if (confirm(`Voulez-vous supprimer ${row[0]} · ${row[1]} ?`)) {
      const mod = this.currentModule();
      const idx = mod.rows.indexOf(row);
      if (idx !== -1) {
        mod.rows.splice(idx, 1);
        this.logAudit('Suppression', this.moduleKey(), row[0]);
        this.showToast('Enregistrement supprimé de la maquette.');
      }
    }
  }

  // Row special actions
  protected validateDocument(row: string[], event: Event): void {
    event.stopPropagation();
    row[5] = 'Validé';
    this.logAudit('Validation document', 'documents', row[0]);
    this.showToast(`Document ${row[0]} validé.`);
  }

  protected returnAffectation(row: string[], event: Event): void {
    event.stopPropagation();
    row[5] = 'Restitué';
    this.logAudit('Restitution matériel', 'affectations', row[0]);
    this.showToast(`Restitution enregistrée pour ${row[0]}.`);
  }

  protected completeRestitution(row: string[], event: Event): void {
    event.stopPropagation();
    row[5] = 'Restitué';
    row[4] = 'Bon état';
    this.logAudit('Clôture restitution', 'restitutions', row[0]);
    this.showToast(`Restitution ${row[0]} clôturée avec succès.`);
  }

  protected exportCSV(targetKey?: string): void {
    const key = targetKey || this.moduleKey();
    const mod = DATASETS[key] || this.currentModule();
    const content = [
      mod.cols.join(';'),
      ...mod.rows.map((r) => r.join(';')),
    ].join('\r\n');
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kai-${key}-demo.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Export CSV généré avec les données de démonstration.');
  }

  protected openAdvancedFilters(): void {
    this.advancedFilterOpen.set(true);
  }

  protected closeAdvancedFilters(): void {
    this.advancedFilterOpen.set(false);
  }

  protected applyAdvancedFilters(): void {
    this.advancedFilterOpen.set(false);
    this.showToast('Filtres appliqués.');
  }

  protected printRecord(): void {
    window.print();
  }

  // Import methods
  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length > 1) {
          const sep = lines[0].includes(';') ? ';' : ',';
          this.parsedImportRows = lines.slice(1).map((l) => l.split(sep).map((c) => c.replace(/^"|"$/g, '').trim()));
          this.importFileReady.set(true);
          this.importFeedback.set(`Fichier détecté : ${file.name} (${this.parsedImportRows.length} lignes valides détectées).`);
        } else {
          this.importFileReady.set(false);
          this.importFeedback.set('Fichier vide ou format non reconnu.');
        }
      };
      reader.readAsText(file);
    }
  }

  protected previewImport(): void {
    if (!this.importFileReady()) {
      this.showToast('Veuillez d’abord choisir un fichier CSV valide.');
      return;
    }
    this.showToast(`Structure validée : ${this.parsedImportRows.length} lignes prêtes à être importées.`);
  }

  protected applyImport(): void {
    if (!this.parsedImportRows.length) return;
    const target = this.importTargetModule();
    const mod = DATASETS[target];
    if (mod) {
      mod.rows.unshift(...this.parsedImportRows);
      this.logAudit('Import CSV', target, `${this.parsedImportRows.length} lignes`);
      this.showToast(`${this.parsedImportRows.length} lignes importées avec succès dans ${mod.title}.`);
      this.importFileReady.set(false);
      this.parsedImportRows = [];
      void this.router.navigate([`/${target}`]);
    }
  }

  // Settings & Profile save
  protected saveSettings(): void {
    this.showToast('Paramètres enregistrés avec succès.');
  }

  protected saveProfile(): void {
    this.showToast('Profil et préférences de sécurité mis à jour.');
  }

  private logAudit(action: string, moduleKey: string, ref: string): void {
    const audit = DATASETS['audit'];
    if (!audit) return;
    const now = new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const nextNum = audit.rows.length + 25;
    const audRef = `AUD-00${nextNum}`;
    const modTitle = DATASETS[moduleKey]?.title || moduleKey;
    audit.rows.unshift([audRef, now, 'Aminata Diallo', `${action} ${ref}`, modTitle, 'Succès']);
  }
}

