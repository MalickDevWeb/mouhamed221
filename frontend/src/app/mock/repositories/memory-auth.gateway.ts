import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthGateway } from '../../core/auth/auth.gateway';
import { AuthUser, Credentials, Session } from '../../core/auth/auth.models';
import { ApiError } from '../../core/http/api-error';
import { simulate } from '../simulate';

export const DEMO_PASSWORD = 'Demo@2026';

export const DEMO_USERS: readonly AuthUser[] = [
  { id: 'usr-1', email: 'admin@kai.sn', fullName: 'Aïssatou Admin', role: 'ADMIN' },
  { id: 'usr-2', email: 'rh@kai.sn', fullName: 'Rama RH', role: 'RH' },
  { id: 'usr-3', email: 'tech@kai.sn', fullName: 'Thierno Technicien', role: 'TECHNICIEN' },
  { id: 'usr-4', email: 'superviseur@kai.sn', fullName: 'Saliou Superviseur', role: 'SUPERVISEUR' },
  { id: 'usr-5', email: 'auditeur@kai.sn', fullName: 'Adja Auditrice', role: 'AUDITEUR' },
];

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const SESSION_MS = 30 * 60 * 1000;

/** Authentification de démonstration ; applique le verrouillage EF-04. */
@Injectable()
export class MemoryAuthGateway extends AuthGateway {
  private readonly failures = new Map<string, { count: number; lockedUntil: number }>();

  override login(credentials: Credentials): Observable<Session> {
    return simulate(() => {
      const email = credentials.email.trim().toLowerCase();
      const state = this.failures.get(email) ?? { count: 0, lockedUntil: 0 };

      if (state.lockedUntil > Date.now()) {
        throw new ApiError(423, 'Compte verrouillé.', 'Trop de tentatives. Réessayez dans 15 minutes.');
      }

      const user = DEMO_USERS.find((candidate) => candidate.email === email);
      if (!user || credentials.password !== DEMO_PASSWORD) {
        const count = state.count + 1;
        this.failures.set(email, { count, lockedUntil: count >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0 });
        // Message volontairement générique : on ne dit pas quel champ est faux.
        throw new ApiError(401, 'Identifiants invalides.', 'E-mail ou mot de passe incorrect.');
      }

      this.failures.delete(email);
      return { accessToken: `demo.${user.id}.${Date.now()}`, expiresAt: Date.now() + SESSION_MS, user };
    });
  }

  override logout(): Observable<void> {
    return simulate(() => undefined);
  }
}
