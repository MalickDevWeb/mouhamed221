import { Observable } from 'rxjs';

import { Page } from '../../../shared/models/page';
import { Assignment, AssignmentQuery, AssignmentReturn, AssignmentView, NewAssignment } from '../assignment.models';

export abstract class AssignmentRepository {
  abstract list(query: AssignmentQuery): Observable<Page<AssignmentView>>;
  abstract create(input: NewAssignment): Observable<Assignment>;
  abstract returnEquipment(id: string, input: AssignmentReturn): Observable<Assignment>;
}
