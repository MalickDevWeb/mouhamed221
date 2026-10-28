import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';

import { Permission } from './permissions';
import { SessionStore } from './session.store';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionStore);
  const router = inject(Router);
  if (session.isAuthenticated()) {
    return true;
  }
  session.clear();
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = () =>
  inject(SessionStore).isAuthenticated() ? inject(Router).createUrlTree(['/dashboard']) : true;

/** Bloque le chargement d'un module si le rôle n'a pas la permission (RG-14 côté interface). */
export function permissionGuard(permission: Permission): CanMatchFn {
  return () => inject(SessionStore).can(permission) || inject(Router).createUrlTree(['/acces-refuse']);
}
