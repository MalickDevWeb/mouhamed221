import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api.config';
import { toHttpParams } from '../../../shared/data/http-params';
import { Page } from '../../../shared/models/page';
import { Assignment, AssignmentQuery, AssignmentReturn, AssignmentView, NewAssignment } from '../assignment.models';
import { AssignmentRepository } from './assignment.repository';

@Injectable()
export class AssignmentHttpRepository extends AssignmentRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/assignments`;

  override list(query: AssignmentQuery): Observable<Page<AssignmentView>> {
    return this.http.get<Page<AssignmentView>>(this.url, { params: toHttpParams(query) });
  }

  override create(input: NewAssignment): Observable<Assignment> {
    return this.http.post<Assignment>(this.url, input);
  }

  override returnEquipment(id: string, input: AssignmentReturn): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.url}/${id}/return`, input);
  }
}
