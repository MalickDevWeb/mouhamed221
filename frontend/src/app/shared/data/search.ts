import { Page } from '../models/page';

/** Minuscules et sans accents, pour une recherche tolérante (« Cisse » trouve « Cissé »). */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function matchesSearch(search: string | undefined, ...fields: (string | null | undefined)[]): boolean {
  if (!search) {
    return true;
  }
  const needle = normalize(search);
  return fields.some((field) => field != null && normalize(field).includes(needle));
}

export function paginate<T>(items: readonly T[], page: number, size: number): Page<T> {
  const totalElements = items.length;
  const start = page * size;
  return {
    content: items.slice(start, start + size),
    totalElements,
    totalPages: Math.ceil(totalElements / size),
    page,
    size,
  };
}
