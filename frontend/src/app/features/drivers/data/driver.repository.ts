import { Observable } from 'rxjs';

import { Page } from '../../../shared/models/page';
import { Driver, DriverInput, DriverQuery } from '../driver.models';

/** Port d'accès aux chauffeurs : les écrans ne connaissent que cette abstraction. */
export abstract class DriverRepository {
  abstract list(query: DriverQuery): Observable<Page<Driver>>;
  abstract get(id: string): Observable<Driver>;
  abstract create(input: DriverInput): Observable<Driver>;
  abstract update(id: string, input: DriverInput): Observable<Driver>;
}
