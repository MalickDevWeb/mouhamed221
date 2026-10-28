export interface FieldError {
  field: string;
  message: string;
}

/** Erreur métier normalisée, construite à partir d'une réponse RFC 7807. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly title: string,
    readonly detail?: string,
    readonly fieldErrors: readonly FieldError[] = [],
  ) {
    super(detail ?? title);
    this.name = 'ApiError';
  }
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.detail ?? error.title;
  }
  return 'Une erreur inattendue est survenue. Veuillez réessayer.';
}
