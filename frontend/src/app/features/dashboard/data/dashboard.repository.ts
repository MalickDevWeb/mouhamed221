import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api.config';
import { DashboardSummary } from '../dashboard.models';

export abstract class DashboardRepository {
  abstract summary(): Observable<DashboardSummary>;
}

@Injectable()
export class DashboardHttpRepository extends DashboardRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/dashboard/summary`;

  override summary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.url);
  }
}
