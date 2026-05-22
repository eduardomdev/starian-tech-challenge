import {
  Directive,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { StrSortGroupDirective, type SortDirection, type SortEvent } from './str-sort-group';

export type { SortDirection, SortEvent };

@Directive({
  selector: 'th[strSort]',
  host: {
    'class': 'str-sort',
    'role': 'button',
    'tabindex': '0',
    '[class.str-sort--active]': 'isActive()',
    '[attr.data-direction]': 'direction()',
    '[attr.aria-sort]': 'ariaSort()',
    '(click)': 'toggle()',
    '(keydown.enter)': 'toggle()',
    '(keydown.space)': 'toggle($event)',
  },
})
export class StrSortDirective {
  readonly strSort = input.required<string>();
  readonly initialDirection = input<SortDirection>(null);
  readonly strSortChange = output<SortEvent>();

  private readonly group = inject(StrSortGroupDirective, { optional: true });
  private readonly localDirection = signal<SortDirection>(this.initialDirection());

  protected readonly direction = computed<SortDirection>(() => {
    if (this.group && this.group.activeField() === this.strSort()) {
      return this.group.activeDirection();
    }
    if (this.group) return null;
    return this.localDirection();
  });

  protected readonly isActive = computed(() => this.direction() !== null);

  protected readonly ariaSort = computed(() => {
    const dir = this.direction();
    return dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
  });

  protected toggle(event?: Event): void {
    event?.preventDefault();
    const next: SortDirection =
      this.direction() === null ? 'asc' : this.direction() === 'asc' ? 'desc' : null;

    if (this.group) {
      this.group.setActive(this.strSort(), next);
    } else {
      this.localDirection.set(next);
    }

    this.strSortChange.emit({ field: this.strSort(), direction: next });
  }
}
