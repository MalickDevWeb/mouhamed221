import { HttpParams } from '@angular/common/http';

/** Transforme un objet de filtres en paramètres HTTP en ignorant les valeurs vides. */
export function toHttpParams(query: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params = params.set(key, String(value));
  }
  return params;
}
