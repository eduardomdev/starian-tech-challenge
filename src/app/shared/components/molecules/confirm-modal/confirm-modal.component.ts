import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';

export interface ConfirmModalData {
  title: string;
  description: string;
  confirmLabel?: string;
  loading: Signal<boolean>;
  onConfirm: (close: () => void) => void;
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrButtonComponent],
})
export class ConfirmModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  protected readonly data = this.config.data as ConfirmModalData;
  protected readonly loading = this.data.loading;

  protected confirm(): void {
    this.data.onConfirm(() => this.ref.close(true));
  }

  protected cancel(): void {
    this.ref.close(false);
  }
}
