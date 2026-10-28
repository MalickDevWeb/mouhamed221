import { Observable, defer, delay, map, of } from 'rxjs';

import { ApiError, FieldError } from '../core/http/api-error';

const LATENCY_MS = 250;

/**
 * Simule un appel réseau : le traitement s'exécute après la latence
 * et le résultat est cloné pour ne jamais exposer l'état interne.
 * Une ApiError levée dans le traitement devient une erreur de l'Observable.
 */
export function simulate<T>(handler: () => T): Observable<T> {
  return defer(() =>
    of(null).pipe(
      delay(LATENCY_MS),
      map(() => structuredClone(handler())),
    ),
  );
}

export function notFound(entity: string): ApiError {
  return new ApiError(404, 'Élément introuvable.', `${entity} introuvable.`);
}

export function conflict(detail: string, fieldErrors: FieldError[] = []): ApiError {
  return new ApiError(409, 'Conflit avec une règle de gestion.', detail, fieldErrors);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
