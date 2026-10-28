import { Signal, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, catchError, debounceTime, of, switchMap, tap } from 'rxjs';

import { errorMessage } from '../../core/http/api-error';
import { Page, emptyPage } from '../models/page';

export interface PagedResource<T> {
  readonly page: Signal<Page<T>>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;
  reload(): void;
}

/**
 * Charge une liste paginée à chaque changement de filtres.
 * À appeler dans un contexte d'injection (initialiseur de champ d'un composant).
 */
export function pagedResource<T, Q>(
  query: Signal<Q>,
  load: (query: Q) => Observable<Page<T>>,
  size: number,
): PagedResource<T> {
  const loading = signal(true);
  const error = signal<string | null>(null);
  const version = signal(0);
  const request = computed(() => ({ query: query(), version: version() }));

  const page = toSignal(
    toObservable(request).pipe(
      debounceTime(200),
      tap(() => {
        loading.set(true);
        error.set(null);
      }),
      switchMap(({ query: current }) =>
        load(current).pipe(
          catchError((cause: unknown) => {
            error.set(errorMessage(cause));
            return of(emptyPage<T>(size));
          }),
        ),
      ),
      tap(() => loading.set(false)),
    ),
    { initialValue: emptyPage<T>(size) },
  );

  return {
    page,
    loading: loading.asReadonly(),
    error: error.asReadonly(),
    reload: () => version.update((value) => value + 1),
  };
}
