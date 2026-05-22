import { Directive, signal } from '@angular/core';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortEvent {
  field: string;
  direction: SortDirection;
}

@Directive({
  selector: '[strSortGroup]',
  exportAs: 'strSortGroup',
})
export class StrSortGroupDirective {
  readonly activeField = signal<string | null>(null);
  readonly activeDirection = signal<SortDirection>(null);

  setActive(field: string, direction: SortDirection): void {
    if (direction === null) {
      this.activeField.set(null);
      this.activeDirection.set(null);
      return;
    }
    this.activeField.set(field);
    this.activeDirection.set(direction);
  }
}
