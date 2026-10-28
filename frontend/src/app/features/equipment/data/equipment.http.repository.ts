import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../../core/http/api.config';
import { toHttpParams } from '../../../shared/data/http-params';
import { Page } from '../../../shared/models/page';
import { Equipment, EquipmentInput, EquipmentQuery } from '../equipment.models';
import { EquipmentRepository } from './equipment.repository';

@Injectable()
export class EquipmentHttpRepository extends EquipmentRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/equipment`;

  override list(query: EquipmentQuery): Observable<Page<Equipment>> {
    return this.http.get<Page<Equipment>>(this.url, { params: toHttpParams(query) });
  }

  override get(id: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.url}/${id}`);
  }

  override create(input: EquipmentInput): Observable<Equipment> {
    return this.http.post<Equipment>(this.url, input);
  }

  override update(id: string, input: EquipmentInput): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.url}/${id}`, input);
  }
}
