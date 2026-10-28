import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, catchError, filter, map, of, switchMap, throwError } from 'rxjs';

import { ApiError } from '../http/api-error';
import { FileStorage, UploadEvent, UploadOptions } from './file-storage';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  folder: string;
  signatureUrl: string | null;
}

export const CLOUDINARY_CONFIG = new InjectionToken<CloudinaryConfig>('CLOUDINARY_CONFIG');

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format?: string;
  bytes: number;
  original_filename?: string;
}

/** Réponse attendue de l'endpoint backend de signature (le secret reste côté serveur). */
interface UploadSignature {
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

@Injectable()
export class CloudinaryFileStorage extends FileStorage {
  private readonly http = inject(HttpClient);
  private readonly config = inject(CLOUDINARY_CONFIG);

  override upload(file: File, options: UploadOptions): Observable<UploadEvent> {
    const folder = `${this.config.folder}/${options.folder}`;
    const endpoint = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/auto/upload`;

    return this.buildForm(file, folder).pipe(
      switchMap((form) => this.http.post<CloudinaryResponse>(endpoint, form, { reportProgress: true, observe: 'events' })),
      map((event): UploadEvent | null => {
        if (event.type === HttpEventType.UploadProgress) {
          return { kind: 'progress', percent: event.total ? Math.round((event.loaded / event.total) * 100) : 0 };
        }
        if (event.type === HttpEventType.Response && event.body) {
          const body = event.body;
          return {
            kind: 'done',
            file: {
              url: body.secure_url,
              publicId: body.public_id,
              originalName: file.name,
              format: body.format ?? file.name.split('.').pop() ?? '',
              bytes: body.bytes,
            },
          };
        }
        return null;
      }),
      filter((event): event is UploadEvent => event !== null),
      catchError((error: unknown) => throwError(() => toUploadError(error))),
    );
  }

  /** Envoi signé si un endpoint backend est configuré, sinon preset « unsigned ». */
  private buildForm(file: File, folder: string): Observable<FormData> {
    const form = new FormData();
    form.append('file', file);

    if (!this.config.signatureUrl) {
      form.append('upload_preset', this.config.uploadPreset);
      form.append('folder', folder);
      return of(form);
    }
    return this.http.post<UploadSignature>(this.config.signatureUrl, { folder }).pipe(
      map((signed) => {
        form.append('api_key', signed.apiKey);
        form.append('timestamp', String(signed.timestamp));
        form.append('signature', signed.signature);
        form.append('folder', signed.folder);
        return form;
      }),
    );
  }
}

function toUploadError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (error instanceof HttpErrorResponse) {
    const message = (error.error as { error?: { message?: string } } | null)?.error?.message;
    return new ApiError(error.status, "Échec de l'envoi du fichier.", message ?? 'Le service de stockage a refusé le fichier.');
  }
  return new ApiError(0, "Échec de l'envoi du fichier.", 'Vérifiez votre connexion et réessayez.');
}
