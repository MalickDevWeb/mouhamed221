import { Routes } from '@angular/router';

import { authGuard, guestGuard, permissionGuard } from './core/auth/auth.guards';
import { ForbiddenPage } from './core/layout/forbidden.page';
import { ShellComponent } from './core/layout/shell.component';
import { ComingSoonPage } from './shared/ui/coming-soon.page';

/** Un module = un dossier dans features/, chargé à la demande et protégé par sa permission. */
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
    title: 'Connexion',
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        canMatch: [permissionGuard('dashboard.read')],
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
      },
      {
        path: 'chauffeurs',
        canMatch: [permissionGuard('drivers.read')],
        loadChildren: () => import('./features/drivers/drivers.routes'),
      },
      {
        path: 'equipements',
        canMatch: [permissionGuard('equipment.read')],
        loadChildren: () => import('./features/equipment/equipment.routes'),
      },
      {
        path: 'affectations',
        canMatch: [permissionGuard('assignments.read')],
        loadChildren: () => import('./features/assignments/assignments.routes'),
      },
      {
        path: 'integration',
        canMatch: [permissionGuard('onboarding.read')],
        component: ComingSoonPage,
        data: { title: 'Intégration des chauffeurs', sprint: 'sprint 5 (semaines 11–12)', requirements: 'EF-29 à EF-33' },
      },
      {
        path: 'enrolements',
        canMatch: [permissionGuard('enrollments.read')],
        component: ComingSoonPage,
        data: { title: 'Enrôlements', sprint: 'sprint 5 (semaines 11–12)', requirements: 'EF-34 à EF-37' },
      },
      {
        path: 'incidents',
        canMatch: [permissionGuard('incidents.read')],
        component: ComingSoonPage,
        data: { title: 'Incidents', sprint: 'sprint 5 (semaines 11–12)', requirements: 'EF-38 à EF-44' },
      },
      {
        path: 'utilisateurs',
        canMatch: [permissionGuard('users.manage')],
        component: ComingSoonPage,
        data: { title: 'Utilisateurs', sprint: 'sprint 2 (semaines 5–6)', requirements: 'EF-05, EF-06' },
      },
      {
        path: 'audit',
        canMatch: [permissionGuard('audit.read')],
        component: ComingSoonPage,
        data: { title: "Journal d'audit", sprint: 'sprint 2 (semaines 5–6)', requirements: 'EF-52, EF-53' },
      },
      { path: 'acces-refuse', component: ForbiddenPage, title: 'Accès refusé' },
    ],
  },
  { path: '**', redirectTo: '' },
];
