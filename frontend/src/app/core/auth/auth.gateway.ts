import { Observable } from 'rxjs';

import { Credentials, Session } from './auth.models';

/** Port d'authentification : l'application dépend de cette abstraction, pas du transport. */
export abstract class AuthGateway {
  abstract login(credentials: Credentials): Observable<Session>;
  abstract logout(): Observable<void>;
}
