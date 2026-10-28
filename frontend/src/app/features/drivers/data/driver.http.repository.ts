import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api.config';
import { toHttpParams } from '../../../shared/data/http-params';
import { Page } from '../../../shared/models/page';
import { Driver, DriverInput, DriverQuery } from '../driver.models';
import { DriverRepository } from './driver.repository';

@Injectable()
export class DriverHttpRepository extends DriverRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/drivers`;

  override list(query: DriverQuery): Observable<Page<Driver>> {
    return this.http.get<Page<Driver>>(this.url, { params: toHttpParams(query) });
  }

  override get(id: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.url}/${id}`);
  }

  override create(input: DriverInput): Observable<Driver> {
    return this.http.post<Driver>(this.url, input);
  }

  override update(id: string, input: DriverInput): Observable<Driver> {
    return this.http.put<Driver>(`${this.url}/${id}`, input);
  }
}
