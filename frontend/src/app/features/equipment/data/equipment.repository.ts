import { Observable } from 'rxjs';

import { Page } from '../../../shared/models/page';
import { Equipment, EquipmentInput, EquipmentQuery } from '../equipment.models';

export abstract class EquipmentRepository {
  abstract list(query: EquipmentQuery): Observable<Page<Equipment>>;
  abstract get(id: string): Observable<Equipment>;
  abstract create(input: EquipmentInput): Observable<Equipment>;
  abstract update(id: string, input: EquipmentInput): Observable<Equipment>;
}
