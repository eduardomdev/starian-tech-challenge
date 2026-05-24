import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrInputComponent } from '@shared/components/atoms/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { CartsIntegrationService } from '../../../../services/carts-integration.service';
import type { Cart, CartProduct } from '@shared/interfaces/cart.interface';

interface CartProductRow {
  productId: string;
  quantity: string;
}

@Component({
  selector: 'app-cart-edit-modal',
  templateUrl: './cart-edit-modal.html',
  styleUrl: './cart-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StrInputComponent, StrButtonComponent, IconComponent],
})
export class CartEditModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly integrationService = inject(CartsIntegrationService);

  protected readonly updateLoading = this.integrationService.updateLoading;

  protected readonly cart = this.config.data as Cart;

  protected readonly cartDate = signal(
    this.cart.date ? this.cart.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
  );

  protected readonly productRows = signal<CartProductRow[]>(
    this.cart.products.map((p) => ({
      productId: String(p.productId),
      quantity: String(p.quantity),
    })),
  );

  protected readonly submitted = signal(false);

  protected readonly isValid = computed(() => {
    if (!this.cartDate()) return false;
    return this.productRows().every(
      (r) => Number(r.productId) > 0 && Number(r.quantity) > 0,
    );
  });

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

    this.integrationService.update(
      this.cart.id,
      { userId: this.cart.userId, date: this.cartDate(), products },
      (updated) => this.ref.close(updated),
    );
  }

  protected cancel(): void {
    this.ref.close();
  }
}
