import { Injectable, computed, signal } from '@angular/core';

import { Session } from './auth.models';
import { Permission, isAllowed } from './permissions';

const STORAGE_KEY = 'kai.session';

/** Unique source de vérité sur l'utilisateur connecté. */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly state = signal<Session | null>(this.restore());

  readonly user = computed(() => this.state()?.user ?? null);
  readonly role = computed(() => this.user()?.role ?? null);

  isAuthenticated(): boolean {
    const session = this.state();
    return session !== null && session.expiresAt > Date.now();
  }

  can(permission: Permission): boolean {
    return isAllowed(this.role(), permission);
  }

  token(): string | null {
    return this.state()?.accessToken ?? null;
  }

  set(session: Session): void {
    this.state.set(session);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Stockage indisponible (navigation privée) : la session reste en mémoire.
    }
  }

  clear(): void {
    this.state.set(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Rien à nettoyer.
    }
  }

  private restore(): Session | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  }
}
