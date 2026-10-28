import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthGateway } from '../../core/auth/auth.gateway';
import { AuthUser, Credentials, Session } from '../../core/auth/auth.models';
import { ApiError } from '../../core/http/api-error';
import { simulate } from '../simulate';

export const DEMO_PASSWORD = 'Demo@2026';
export const KAI_DEMO_PASSWORD = 'KAI2026!';

export const DEMO_USERS: readonly AuthUser[] = [
  { id: 'usr-1', email: 'admin@kai.demo', fullName: 'Aminata Diallo', role: 'ADMIN' },
  { id: 'usr-1-bis', email: 'admin@kai.sn', fullName: 'Aminata Diallo', role: 'ADMIN' },
  { id: 'usr-1-ter', email: 'a.diallo@kai.demo', fullName: 'Aminata Diallo', role: 'ADMIN' },
  { id: 'usr-2', email: 'parc@kai.demo', fullName: 'Moussa Camara', role: 'RH' },
  { id: 'usr-2-bis', email: 'rh@kai.sn', fullName: 'Moussa Camara', role: 'RH' },
  { id: 'usr-2-ter', email: 'm.camara@kai.demo', fullName: 'Moussa Camara', role: 'RH' },
  { id: 'usr-3', email: 'tech@kai.demo', fullName: 'Khadija Faye', role: 'TECHNICIEN' },
  { id: 'usr-3-bis', email: 'tech@kai.sn', fullName: 'Khadija Faye', role: 'TECHNICIEN' },
  { id: 'usr-3-ter', email: 'k.faye@kai.demo', fullName: 'Khadija Faye', role: 'TECHNICIEN' },
  { id: 'usr-4', email: 'superviseur@kai.demo', fullName: 'Ousmane Kane', role: 'SUPERVISEUR' },
  { id: 'usr-4-bis', email: 'superviseur@kai.sn', fullName: 'Ousmane Kane', role: 'SUPERVISEUR' },
  { id: 'usr-4-ter', email: 'o.kane@kai.demo', fullName: 'Ousmane Kane', role: 'SUPERVISEUR' },
  { id: 'usr-5', email: 'lecture@kai.demo', fullName: 'Fatou Sarr', role: 'AUDITEUR' },
  { id: 'usr-5-bis', email: 'auditeur@kai.sn', fullName: 'Fatou Sarr', role: 'AUDITEUR' },
  { id: 'usr-5-ter', email: 'auditeur@kai.demo', fullName: 'Fatou Sarr', role: 'AUDITEUR' },
];

const SESSION_MS = 24 * 60 * 60 * 1000;

/** Authentification de démonstration pour l'espace KAI. */
@Injectable()
export class MemoryAuthGateway extends AuthGateway {
  override login(credentials: Credentials): Observable<Session> {
    return simulate(() => {
      const email = (credentials.email || '').trim().toLowerCase();
      const pwd = (credentials.password || '').trim();

      if (!email) {
        throw new ApiError(400, 'Identifiant manquant', 'Veuillez saisir votre adresse e-mail.');
      }

      // Recherche dans la liste des profils de démo KAI
      let user = DEMO_USERS.find((u) => u.email === email);

      // Si l'utilisateur a tapé une autre adresse dans la démo, on lui attribue un profil
      if (!user) {
        let role: 'ADMIN' | 'RH' | 'TECHNICIEN' | 'SUPERVISEUR' | 'AUDITEUR' = 'ADMIN';
        if (email.includes('parc') || email.includes('rh') || email.includes('camara')) {
          role = 'RH';
        } else if (email.includes('tech') || email.includes('faye')) {
          role = 'TECHNICIEN';
        } else if (email.includes('supervis') || email.includes('kane')) {
          role = 'SUPERVISEUR';
        } else if (email.includes('lect') || email.includes('audit') || email.includes('sarr')) {
          role = 'AUDITEUR';
        }

        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const fullName = namePart
          ? namePart.charAt(0).toUpperCase() + namePart.slice(1)
          : 'Utilisateur KAI';

        user = {
          id: `usr-${Date.now()}`,
          email,
          fullName,
          role,
        };
      }

      // En mode maquette, mot de passe accepté s'il n'est pas vide
      return {
        accessToken: `demo.${user.id}.${Date.now()}`,
        expiresAt: Date.now() + SESSION_MS,
        user,
      };
    });
  }

  override logout(): Observable<void> {
    return simulate(() => undefined);
  }
}
