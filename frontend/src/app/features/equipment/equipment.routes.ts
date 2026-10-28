import { Routes } from '@angular/router';

import { permissionGuard } from '../../core/auth/auth.guards';
import { EquipmentFormPage } from './pages/equipment-form.page';
import { EquipmentListPage } from './pages/equipment-list.page';

export default [
  { path: '', component: EquipmentListPage, title: 'Parc informatique' },
  { path: 'nouveau', component: EquipmentFormPage, canMatch: [permissionGuard('equipment.write')], title: 'Nouvel équipement' },
  { path: ':id/modifier', component: EquipmentFormPage, canMatch: [permissionGuard('equipment.write')], title: "Modifier l'équipement" },
] satisfies Routes;
