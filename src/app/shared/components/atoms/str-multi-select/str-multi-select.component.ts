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
import { IconComponent } from '../icon/icon';

export interface StrMultiSelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'str-multi-select',
  templateUrl: './str-multi-select.component.html',
  styleUrl: './str-multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    class: 'str-multi-select-host',
  },
})
export class StrMultiSelectComponent {
  private readonly el = inject(ElementRef);

  readonly options = input<StrMultiSelectOption[]>([]);
  readonly value = model<string[]>([]);
  readonly placeholder = input<string>('Selecione opções');
  readonly label = input<string>('');
  readonly iconName = input<string>('label');
  readonly disabled = input<boolean>(false);

  protected readonly isOpen = signal(false);

  protected readonly selectedCount = computed(() => this.value().length);

  protected readonly isSelected = computed(() => (optionValue: string) => this.value().includes(optionValue));

  protected toggle(): void {
    if (!this.disabled()) {
      this.isOpen.update((v) => !v);
    }
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected toggleOption(optionValue: string): void {
    const current = this.value();
    if (current.includes(optionValue)) {
      this.value.set(current.filter((v) => v !== optionValue));
      return;
    } 
    this.value.set([...current, optionValue]);
  }

  protected clearAll(): void {
    this.value.set([]);
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
