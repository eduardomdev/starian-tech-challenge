import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { StrInputComponent } from '@shared/components/atoms/inputs/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import { CartFormService } from '../../../../services/cart-form/cart-form.service';
import { StrQuantityToggleComponent } from '@shared/components/atoms/str-quantity-toggle/str-quantity-toggle.component';

import type { Product } from '@shared/interfaces/products.interface';
import type { Cart } from '@shared/interfaces/cart.interface';
import type { SelectedItem } from '../../../../services/cart-form/cart-form.service';

@Component({
  selector: 'app-cart-edit-modal',
  templateUrl: './cart-edit-modal.html',
  styleUrl: './cart-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CartFormService],
  imports: [
    StrInputComponent,
    StrButtonComponent,
    IconComponent,
    StrSkeletonComponent,
    DecimalPipe,
    StrQuantityToggleComponent,
  ],
})
export class CartEditModalComponent {
  private readonly dialogRef = inject(DynamicDialogRef);
  private readonly dialogConfig = inject(DynamicDialogConfig);
  private readonly cartsIntegration = inject(CartsIntegrationService);

  protected readonly form = inject(CartFormService);

  protected readonly cart = this.dialogConfig.data as Cart;
  protected readonly updateLoading = this.cartsIntegration.updateLoading;

  private readonly initDone = signal(false);

  constructor() {
    this.syncSelectedItemsFromCart();
  }

  protected submit(): void {
    if (!this.form.isValid()) return;

    this.cartsIntegration.update(
      this.cart.id,
      { userId: this.cart.userId, products: this.form.buildProductsPayload() },
      (updated) => this.dialogRef.close(updated),
    );
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  private syncSelectedItemsFromCart(): void {
    effect(() => {
      if (this.initDone()) return;

      const products = this.form.allProducts();
      if (!products?.length) return;

      this.initDone.set(true);

      const quantityByProductId = this.buildQuantityMap(this.cart.products);
      const items = this.resolveSelectedItems(products, quantityByProductId);

      untracked(() => this.form.selectedItems.set(items));
    });
  }

  private buildQuantityMap(cartProducts: Cart['products']): Map<number, number> {
    const map = new Map<number, number>();

    for (const entry of cartProducts) {
      map.set(entry.productId, (map.get(entry.productId) ?? 0) + entry.quantity);
    }

    return map;
  }

  private resolveSelectedItems(
    products: Product[],
    quantityMap: Map<number, number>,
  ): SelectedItem[] {
    const items: SelectedItem[] = [];

    quantityMap.forEach((quantity, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        items.push({ product, quantity });
      }
    });

    return items;
  }
}
