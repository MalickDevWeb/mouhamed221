import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { API_BASE_URL } from '../http/api.config';
import { AuthGateway } from './auth.gateway';
import { AuthUser, Credentials, Session } from './auth.models';

interface LoginResponse {
  accessToken: string;
  /** Durée de validité en secondes. */
  expiresIn: number;
  user: AuthUser;
}

@Injectable()
export class HttpAuthGateway extends AuthGateway {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/auth`;

  override login(credentials: Credentials): Observable<Session> {
    return this.http.post<LoginResponse>(`${this.url}/login`, credentials).pipe(
      map((response) => ({
        accessToken: response.accessToken,
        expiresAt: Date.now() + response.expiresIn * 1000,
        user: response.user,
      })),
    );
  }

  override logout(): Observable<void> {
    return this.http.post<void>(`${this.url}/logout`, {});
  }
}
