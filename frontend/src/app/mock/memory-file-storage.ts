import { Injectable } from '@angular/core';
import { Observable, concat, interval, map, of, take } from 'rxjs';

import { FileStorage, UploadEvent, UploadOptions } from '../core/files/file-storage';

/**
 * Stockage simulé quand Cloudinary n'est pas configuré :
 * le fichier reste dans le navigateur (URL blob) le temps de la session.
 */
@Injectable()
export class MemoryFileStorage extends FileStorage {
  override upload(file: File, options: UploadOptions): Observable<UploadEvent> {
    const progress$ = interval(120).pipe(
      take(4),
      map((step): UploadEvent => ({ kind: 'progress', percent: (step + 1) * 25 })),
    );
    const done$ = of<UploadEvent>({
      kind: 'done',
      file: {
        url: URL.createObjectURL(file),
        publicId: `${options.folder}/${crypto.randomUUID()}`,
        originalName: file.name,
        format: file.name.split('.').pop()?.toLowerCase() ?? '',
        bytes: file.size,
      },
    });
    return concat(progress$, done$);
  }
}
