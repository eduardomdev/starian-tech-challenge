import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrInputComponent } from '@shared/components/atoms/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import type { CartProduct } from '@shared/interfaces/cart.interface';

interface CartProductRow {
  productId: string;
  quantity: string;
}

interface CartAddConfig {
  userId: number;
}

@Component({
  selector: 'app-cart-add-modal',
  templateUrl: './cart-add-modal.html',
  styleUrl: './cart-add-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrInputComponent, StrButtonComponent, IconComponent],
})
export class CartAddModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly integrationService = inject(CartsIntegrationService);

  protected readonly addLoading = this.integrationService.addLoading;

  private readonly userId = (this.config.data as CartAddConfig).userId;

  protected readonly productRows = signal<CartProductRow[]>([{ productId: '', quantity: '1' }]);
  protected readonly submitted = signal(false);

  protected readonly isValid = computed(() =>
    this.productRows().every(
      (r) => Number(r.productId) > 0 && Number(r.quantity) > 0,
    ),
  );

  protected updateRow(index: number, field: keyof CartProductRow, value: string): void {
    this.productRows.update((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  protected addRow(): void {
    this.productRows.update((rows) => [...rows, { productId: '', quantity: '1' }]);
  }

  protected removeRow(index: number): void {
    this.productRows.update((rows) => rows.filter((_, i) => i !== index));
  }

  protected submit(): void {
    this.submitted.set(true);
    if (!this.isValid()) return;

    const products: CartProduct[] = this.productRows().map((r) => ({
      productId: Number(r.productId),
      quantity: Number(r.quantity),
    }));

    this.integrationService.add(
      { userId: this.userId, products },
      (created) => this.ref.close(created),
    );
  }

  protected cancel(): void {
    this.ref.close();
  }
}
