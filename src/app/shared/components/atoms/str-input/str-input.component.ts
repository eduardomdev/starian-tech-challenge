import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import type { ValidationError, FormValueControl } from '@angular/forms/signals';
import { StrNumbersOnlyDirective } from '@shared/directives/str-numbers-only/str-numbers-only.directive';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { createSizeComputed, type SizeVariant } from '@shared/utils/size-config';

export type InputType = 'text' | 'password' | 'email';
export type InputVariant = 'primary' | 'secondary';

@Component({
  selector: 'str-input',
  templateUrl: './str-input.component.html',
  styleUrl: './str-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrNumbersOnlyDirective, IconComponent],
})
export class StrInputComponent implements FormValueControl<string> {
  readonly value = model<string>('');
  readonly touched = model<boolean>(false);
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);

  readonly label = input<string>('');
  readonly type = input<InputType>('text');
  readonly placeholder = input<string>('');
  readonly inputId = input<string>('');
  readonly maxLength = input<number | undefined>(undefined);
  readonly numbersOnly = input<boolean>(false);
  readonly variant = input<InputVariant>('primary');
  readonly ariaLabel = input<string>('');
  readonly size = input<SizeVariant>('md');

  protected readonly showPassword = signal(false);
  protected readonly isPassword = computed(() => this.type() === 'password');

  protected readonly resolvedType = computed(() =>
    this.isPassword() && this.showPassword() ? 'text' : this.type(),
  );

  protected readonly showError = computed(() => this.invalid() && this.touched());
  protected readonly firstError = computed(() => this.errors()[0]?.message ?? 'Campo inválido');

  protected readonly sizeHeight = createSizeComputed(this.size, {
    sm: '32px',
    md: '40px',
    lg: '48px',
  });

  protected togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected onBlur(): void {
    this.touched.set(true);
  }
}
