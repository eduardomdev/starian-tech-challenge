import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ValidationError } from '@angular/forms/signals';
import type { FormValueControl } from '@angular/forms/signals';
import { IconComponent } from '@shared/components/atoms/icon/icon';

export interface StrSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'str-select',
  templateUrl: './str-select.component.html',
  styleUrl: './str-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class StrSelectComponent implements FormValueControl<string> {
  private readonly el = inject(ElementRef);

  readonly value = model<string>('');
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  readonly invalid = input<boolean>(false);
  readonly touched = model<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);

  readonly label = input<string>('');
  readonly inputId = input<string>('');
  readonly placeholder = input<string>('Selecione uma opção');
  readonly options = input<StrSelectOption[]>([]);

  protected readonly isOpen = signal(false);

  protected readonly showError = computed(() => this.invalid() && this.touched());
  protected readonly firstError = computed(() => this.errors()[0]?.message ?? 'Campo inválido');
  protected readonly selectedLabel = computed(() =>
    this.options().find(o => o.value === this.value())?.label ?? ''
  );

  protected toggle(): void {
    if (!this.disabled()) this.isOpen.update(v => !v);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected selectOption(value: string): void {
    this.value.set(value);
    this.touched.set(true);
    this.isOpen.set(false);
    this.focusTrigger();
  }

  protected openAndFocusOption(event: Event): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.isOpen.set(true);

    requestAnimationFrame(() => {
      const opts = this.optionElements();
      const i = this.options().findIndex(o => o.value === this.value());
      opts[Math.max(i, 0)]?.focus();
    });
  }

  protected navigateOption(event: Event, delta: 1 | -1, index: number): void {
    event.preventDefault();
    this.optionElements()[index + delta]?.focus();
  }

  protected focusTrigger(): void {
    (this.el.nativeElement.querySelector('.str-select__trigger') as HTMLElement | null)?.focus();
  }

  protected onTriggerBlur(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (!related || !this.el.nativeElement.contains(related)) {
      this.touched.set(true);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target) && this.isOpen()) {
      this.touched.set(true);
      this.isOpen.set(false);
    }
  }

  private optionElements(): HTMLElement[] {
    return Array.from(this.el.nativeElement.querySelectorAll('[role="option"]'));
  }
}
