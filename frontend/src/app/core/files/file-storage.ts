import { Observable } from 'rxjs';

/** Fichier hébergé : seules ces métadonnées sont envoyées à l'API backend. */
export interface StoredFile {
  url: string;
  /** Identifiant chez l'hébergeur (public_id Cloudinary), utile pour une suppression côté backend. */
  publicId: string;
  originalName: string;
  format: string;
  bytes: number;
}

export type UploadEvent = { kind: 'progress'; percent: number } | { kind: 'done'; file: StoredFile };

export interface UploadOptions {
  /** Sous-dossier, par exemple `drivers/<id>/documents`. */
  folder: string;
}

/** Port de stockage : les écrans ignorent si le fichier part sur Cloudinary ou ailleurs. */
export abstract class FileStorage {
  abstract upload(file: File, options: UploadOptions): Observable<UploadEvent>;
}
