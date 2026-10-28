import { Routes } from '@angular/router';

import { permissionGuard } from '../../core/auth/auth.guards';
import { AssignmentFormPage } from './pages/assignment-form.page';
import { AssignmentListPage } from './pages/assignment-list.page';

export default [
  { path: '', component: AssignmentListPage, title: 'Affectations' },
  {
    path: 'nouvelle',
    component: AssignmentFormPage,
    canMatch: [permissionGuard('assignments.write')],
    title: 'Nouvelle affectation',
  },
] satisfies Routes;
