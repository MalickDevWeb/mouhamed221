import { Role } from './roles';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface Session {
  accessToken: string;
  /** Horodatage (ms) d'expiration du jeton d'accès. */
  expiresAt: number;
  user: AuthUser;
}

export interface Credentials {
  email: string;
  password: string;
}
