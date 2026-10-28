import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

/** Vrai seulement pour les appels à notre API (jamais pour Cloudinary ou un autre tiers). */
export function isApiRequest(url: string, apiBaseUrl: string): boolean {
  return url.startsWith(apiBaseUrl);
}
