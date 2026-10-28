import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_BASE_URL, isApiRequest } from '../http/api.config';
import { SessionStore } from './session.store';

/** Ajoute le jeton uniquement vers notre API : il ne doit jamais partir chez un tiers. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(SessionStore).token();
  if (!token || !isApiRequest(req.url, inject(API_BASE_URL))) {
    return next(req);
  }
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
