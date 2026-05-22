import { Directive, input } from '@angular/core';

@Directive({
  selector: '[strNumbersOnly]',
  host: {
    '(input)': 'onInput($event)',
  },
})
export class StrNumbersOnlyDirective {
  readonly strNumbersOnly = input<boolean>(false);

  protected onInput(event: Event): void {
    if (!this.strNumbersOnly()) return;

    const el = event.target as HTMLInputElement;
    const filtered = el.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\.\d*)\./g, '$1');

    if (el.value !== filtered) {
      el.value = filtered;
    }
  }
}
