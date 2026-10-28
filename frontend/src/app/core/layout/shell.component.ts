import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { SessionStore } from '../auth/session.store';
import { NAV_GROUPS } from './navigation';

export interface DemoProfile {
  id: string;
  name: string;
  short: string;
  role: string;
  initials: string;
  email: string;
  description: string;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: 'admin',
    name: 'Aminata Diallo',
    short: 'Aminata',
    role: 'Administratrice',
    initials: 'AD',
    email: 'admin@kai.demo',
    description: 'Pilotage complet, administration, sécurité, gestion du parc et suivi de toutes les opérations.',
  },
  {
    id: 'manager',
    name: 'Moussa Camara',
    short: 'Moussa',
    role: 'Gestionnaire de parc',
    initials: 'MC',
    email: 'parc@kai.demo',
    description: 'Gestion des véhicules, conducteurs, équipements, cartes SIM, remises et restitutions.',
  },
  {
    id: 'technician',
    name: 'Khadija Faye',
    short: 'Khadija',
    role: 'Technicienne',
    initials: 'KF',
    email: 'tech@kai.demo',
    description: 'Traitement des incidents, interventions techniques, diagnostics et demandes d’enrôlement.',
  },
  {
    id: 'supervisor',
    name: 'Ousmane Kane',
    short: 'Ousmane',
    role: 'Superviseur',
    initials: 'OK',
    email: 'superviseur@kai.demo',
    description: 'Suivi des équipes, validation des dossiers, contrôle opérationnel et indicateurs de performance.',
  },
  {
    id: 'reader',
    name: 'Fatou Sarr',
    short: 'Fatou',
    role: 'Lectrice · Direction',
    initials: 'FS',
    email: 'lecture@kai.demo',
    description: 'Consultation des indicateurs, rapports et états du parc sans modification des dossiers.',
  },
];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly navGroups = NAV_GROUPS;
  protected readonly menuOpen = signal(false);
  protected readonly roleModalOpen = signal(false);
  protected readonly logoutModalOpen = signal(false);
  protected readonly helpModalOpen = signal(false);
  protected readonly toastMessage = signal<string | null>(null);

  protected readonly activeProfileId = signal<string>('admin');
  protected readonly currentProfile = computed(() => {
    return DEMO_PROFILES.find((p) => p.id === this.activeProfileId()) || DEMO_PROFILES[0];
  });

  protected readonly userFullName = computed(() => this.currentProfile().name);
  protected readonly userShortName = computed(() => this.currentProfile().short);
  protected readonly userRoleLabel = computed(() => this.currentProfile().role);
  protected readonly userInitials = computed(() => this.currentProfile().initials);

  protected showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 3000);
  }

  protected openRoleModal(): void {
    this.roleModalOpen.set(true);
  }

  protected closeRoleModal(): void {
    this.roleModalOpen.set(false);
  }

  protected selectProfile(profileId: string): void {
    this.activeProfileId.set(profileId);
    this.roleModalOpen.set(false);
    this.showToast(`Profil actif : ${this.currentProfile().role}. Interface adaptée.`);
  }

  protected confirmLogout(): void {
    this.logoutModalOpen.set(true);
  }

  protected closeLogoutModal(): void {
    this.logoutModalOpen.set(false);
  }

  protected executeLogout(): void {
    this.logoutModalOpen.set(false);
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  protected openHelp(): void {
    this.helpModalOpen.set(true);
  }

  protected closeHelpModal(): void {
    this.helpModalOpen.set(false);
  }
}
