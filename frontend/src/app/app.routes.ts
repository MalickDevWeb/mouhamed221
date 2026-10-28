import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guards';
import { ForbiddenPage } from './core/layout/forbidden.page';
import { ShellComponent } from './core/layout/shell.component';

/** Routes principales de la plateforme KAI · FLEET & OPERATIONS. */
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
    title: 'Connexion · KAI',
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
      },
      {
        path: 'vehicules',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'vehicules' },
        title: 'Parc véhicules · KAI',
      },
      {
        path: 'chauffeurs',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'chauffeurs' },
        title: 'Gestion des chauffeurs · KAI',
      },
      {
        path: 'conducteurs',
        redirectTo: 'chauffeurs',
      },
      {
        path: 'equipements',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'equipements' },
        title: 'Parc informatique · KAI',
      },
      {
        path: 'sim',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'sim' },
        title: 'Gestion des cartes SIM · KAI',
      },
      {
        path: 'affectations',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'affectations' },
        title: 'Affectations & restitutions · KAI',
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'maintenance' },
        title: 'Maintenance & interventions · KAI',
      },
      {
        path: 'integration',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'integration' },
        title: 'Dossiers d’intégration · KAI',
      },
      {
        path: 'enrolements',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'enrolements' },
        title: 'Demandes d’enrôlement · KAI',
      },
      {
        path: 'incidents',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'incidents' },
        title: 'Incidents & signalements · KAI',
      },
      {
        path: 'documents',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'documents' },
        title: 'Documents chauffeurs · KAI',
      },
      {
        path: 'restitutions',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'restitutions' },
        title: 'Restitutions de matériel · KAI',
      },
      {
        path: 'historique',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'historique' },
        title: 'Historique des affectations · KAI',
      },
      {
        path: 'analytics',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'analytics' },
        title: 'Analytics · KAI',
      },
      {
        path: 'acces',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'acces' },
        title: 'Gestion des accès · KAI',
      },
      {
        path: 'utilisateurs',
        redirectTo: 'acces',
      },
      {
        path: 'gestion-acces',
        redirectTo: 'acces',
      },
      {
        path: 'audit',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'audit' },
        title: 'Journal d’audit · KAI',
      },
      {
        path: 'importexport',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'importexport' },
        title: 'Import / Export · KAI',
      },
      {
        path: 'profil',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'profil' },
        title: 'Mon profil & sécurité · KAI',
      },
      {
        path: 'parametres',
        loadComponent: () => import('./shared/ui/kai-table.page').then((m) => m.KaiTablePage),
        data: { moduleKey: 'parametres' },
        title: 'Paramètres · KAI',
      },
      { path: 'acces-refuse', component: ForbiddenPage, title: 'Accès refusé · KAI' },
    ],
  },
  { path: '**', redirectTo: '' },
];
