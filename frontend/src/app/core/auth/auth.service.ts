import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, tap } from 'rxjs';

import { AuthGateway } from './auth.gateway';
import { Credentials, Session } from './auth.models';
import { SessionStore } from './session.store';

/** Façade utilisée par les écrans : orchestre la passerelle et la session. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly gateway = inject(AuthGateway);
  private readonly session = inject(SessionStore);
  private readonly router = inject(Router);

  login(credentials: Credentials): Observable<Session> {
    return this.gateway.login(credentials).pipe(tap((session) => this.session.set(session)));
  }

  logout(): void {
    this.gateway
      .logout()
      .pipe(
        finalize(() => {
          this.session.clear();
          void this.router.navigate(['/login']);
        }),
      )
      .subscribe({ error: () => undefined });
  }
}
