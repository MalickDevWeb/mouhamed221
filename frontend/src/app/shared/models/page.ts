/** Page de résultats renvoyée par l'API (section 12.1 : pagination côté serveur). */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface PageQuery {
  page: number;
  size: number;
  search?: string;
}

export function emptyPage<T>(size: number): Page<T> {
  return { content: [], totalElements: 0, totalPages: 0, page: 0, size };
}
