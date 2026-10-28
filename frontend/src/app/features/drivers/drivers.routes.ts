import { Routes } from '@angular/router';

import { permissionGuard } from '../../core/auth/auth.guards';
import { DriverDetailPage } from './pages/driver-detail.page';
import { DriverFormPage } from './pages/driver-form.page';
import { DriverListPage } from './pages/driver-list.page';

export default [
  { path: '', component: DriverListPage, title: 'Chauffeurs' },
  { path: 'nouveau', component: DriverFormPage, canMatch: [permissionGuard('drivers.write')], title: 'Nouveau chauffeur' },
  { path: ':id', component: DriverDetailPage, title: 'Fiche chauffeur' },
  { path: ':id/modifier', component: DriverFormPage, canMatch: [permissionGuard('drivers.write')], title: 'Modifier le chauffeur' },
] satisfies Routes;
