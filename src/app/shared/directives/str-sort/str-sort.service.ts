import { Injectable, signal } from '@angular/core';
import { sortByField } from '../../utils/sort.utils';
import type { SortDirection, SortEvent } from './str-sort.directive';

@Injectable()
export class SortService {
  readonly sortField = signal<string | null>(null);
  readonly sortDirection = signal<SortDirection>(null);

  onSort({ field, direction }: SortEvent): void {
    this.sortField.set(direction ? field : null);
    this.sortDirection.set(direction);
  }

  sort<T>(items: T[]): T[] {
    return sortByField(items, this.sortField() ?? '', this.sortDirection());
  }
}
