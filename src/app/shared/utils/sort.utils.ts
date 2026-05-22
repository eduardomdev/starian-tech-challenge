import type { SortDirection } from '../directives/str-sort/str-sort.directive';

export function getNestedValue(obj: unknown, path: string): number | string {
  const value = path.split('.').reduce((acc, key) => (acc as Record<string, unknown>)?.[key], obj);
  return value as number | string;
}

export function sortByField<T>(items: T[], field: string, direction: SortDirection): T[] {
  if (!field || !direction) return items;

  return [...items].sort((a, b) => {
    const aVal = getNestedValue(a, field);
    const bVal = getNestedValue(b, field);
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
