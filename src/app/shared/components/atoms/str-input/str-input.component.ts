import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import type { FormValueControl } from '@angular/forms/signals';
import { StrNumbersOnlyDirective } from '@shared/directives/str-numbers-only/str-numbers-only.directive';
import { createSizeComputed, type SizeVariant } from '@shared/utils/size-config';

@Component({
  selector: 'str-input',
  templateUrl: './str-input.component.html',
  styleUrl: './str-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrNumbersOnlyDirective],
})
export class StrInputComponent implements FormValueControl<string> {
  readonly value = model<string>('');

  readonly errors  = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input<boolean>(false);
  readonly touched = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);

  readonly label = input<string>('');
  readonly type = input<'text' | 'password' | 'email'>('text');
  readonly placeholder = input<string>('');
  readonly inputId = input<string>('');
  readonly maxLength = input<number | undefined>(undefined);
  readonly numbersOnly = input<boolean>(false);
  readonly variant = input<'primary' | 'secondary'>('primary');
  readonly ariaLabel = input<string>('');
  readonly size = input<SizeVariant>('md');

  protected readonly showError  = computed(() => this.invalid() && this.touched());
  protected readonly firstError = computed(() => this.errors()[0]?.message ?? 'Campo inválido');

  protected readonly sizeHeight = createSizeComputed(this.size, {
    sm: '32px',
    md: '40px',
    lg: '48px',
  });

  protected readonly fieldClasses = computed(() => {
    const classField = ['str-input__field'];
    if (this.variant() === 'secondary') classField.push('str-input__field--secondary');
    if (this.showError()) classField.push('str-input__field--invalid');
    return classField.join(' ');
  });

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onBlur(): void {
    this.touched.set(true);
  }
}
