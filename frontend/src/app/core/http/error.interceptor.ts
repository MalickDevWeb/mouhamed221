import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { SessionStore } from '../auth/session.store';
import { ApiError, FieldError } from './api-error';
import { API_BASE_URL, isApiRequest } from './api.config';

interface ProblemDetails {
  title?: string;
  detail?: string;
  fieldErrors?: FieldError[];
}

const DEFAULT_TITLES: Record<number, string> = {
  0: 'Serveur injoignable. Vérifiez votre connexion.',
  400: 'Données invalides.',
  401: 'Session expirée. Veuillez vous reconnecter.',
  403: "Vous n'avez pas les droits pour cette action.",
  404: 'Élément introuvable.',
  409: 'Conflit avec une règle de gestion.',
  422: 'Opération non autorisée dans cet état.',
};

/** Convertit les erreurs de notre API en ApiError et gère l'expiration de session (EF-02). */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url, inject(API_BASE_URL))) {
    return next(req);
  }
  const session = inject(SessionStore);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }
      if (error.status === 401) {
        session.clear();
        void router.navigate(['/login']);
      }
      const problem = (error.error ?? {}) as ProblemDetails;
      return throwError(
        () =>
          new ApiError(
            error.status,
            problem.title ?? DEFAULT_TITLES[error.status] ?? 'Erreur serveur.',
            problem.detail,
            problem.fieldErrors ?? [],
          ),
      );
    }),
  );
};
