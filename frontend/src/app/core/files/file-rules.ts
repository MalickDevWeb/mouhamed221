/** Règles EF-11 / SEC-06 : PDF, JPG ou PNG, 5 Mo maximum. */
export const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'] as const;
export const ACCEPT_ATTRIBUTE = '.pdf,.jpg,.jpeg,.png';
export const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Signatures binaires : on vérifie le contenu réel, pas seulement l'extension. */
const SIGNATURES: Record<(typeof ACCEPTED_MIME_TYPES)[number], number[]> = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
};

export function checkFileSize(file: Pick<File, 'size'>): string | null {
  if (file.size === 0) {
    return 'Le fichier est vide.';
  }
  return file.size > MAX_FILE_BYTES ? 'Le fichier dépasse 5 Mo.' : null;
}

/** Retourne un message d'erreur, ou null si le fichier est acceptable. */
export async function validateFile(file: File): Promise<string | null> {
  const sizeError = checkFileSize(file);
  if (sizeError) {
    return sizeError;
  }
  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  return detectType(header) ? null : 'Format non accepté : PDF, JPG ou PNG uniquement.';
}

export function detectType(header: Uint8Array): (typeof ACCEPTED_MIME_TYPES)[number] | null {
  for (const type of ACCEPTED_MIME_TYPES) {
    if (SIGNATURES[type].every((byte, index) => header[index] === byte)) {
      return type;
    }
  }
  return null;
}
