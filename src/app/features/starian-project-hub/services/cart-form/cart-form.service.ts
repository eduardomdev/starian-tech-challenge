import { computed, inject, Injectable, signal } from '@angular/core';

import { ProductsService } from '@shared/services/products.service';
import { FilterProductsService } from '../filter-products/filter-products.service';

import type { Product } from '@shared/interfaces/products.interface';
import type { CartProductPayload } from '@shared/interfaces/cart.interface';

/** Represents a product selected by the user with its desired quantity. */
export interface SelectedItem {
  readonly product: Product;
  readonly quantity: number;
}

/**
 * Encapsulates the shared state and mutation logic for cart add/edit forms.
 * Must be provided at the component level (not root) to keep state isolated per dialog.
 */
@Injectable()
export class CartFormService {
  private readonly productsService = inject(ProductsService);
  private readonly filterProducts = inject(FilterProductsService);

  readonly searchQuery = signal('');
  readonly selectedItems = signal<SelectedItem[]>([]);

  readonly allProducts = computed(() => this.productsService.products.value() ?? []);
  readonly productsLoading = computed(() => this.productsService.products.isLoading());
  readonly productsError = computed(() => this.productsService.products.error() != null);
  readonly isValid = computed(() => this.selectedItems().length > 0);

  readonly selectedIds = computed(() =>
    new Set(this.selectedItems().map((item) => item.product.id)),
  );

  readonly filteredProducts = computed(() => {
    const available = this.allProducts().filter((p) => !this.selectedIds().has(p.id));
    return this.filterProducts.filterByText(available, this.searchQuery());
  });

  addProduct(product: Product): void {
    if (this.selectedIds().has(product.id)) return;
    this.selectedItems.update((items) => [...items, { product, quantity: 1 }]);
  }

  increaseQuantity(productId: number): void {
    this.selectedItems.update((items) =>
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  decreaseQuantity(productId: number): void {
    this.selectedItems.update((items) => {
      const target = items.find((item) => item.product.id === productId);
      if (!target) return items;

      return target.quantity <= 1
        ? this.removeById(items, productId)
        : this.updateQuantity(items, productId, target.quantity - 1);
    });
  }

  removeProduct(productId: number): void {
    this.selectedItems.update((items) => this.removeById(items, productId));
  }

  buildProductsPayload(): CartProductPayload[] {
    return this.selectedItems().flatMap((item) =>
      Array.from({ length: item.quantity }, () => this.toProductPayload(item.product)),
    );
  }

  private removeById(items: SelectedItem[], productId: number): SelectedItem[] {
    return items.filter((item) => item.product.id !== productId);
  }

  private updateQuantity(
    items: SelectedItem[],
    productId: number,
    newQuantity: number,
  ): SelectedItem[] {
    return items.map((item) =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item,
    );
  }

  private toProductPayload(product: Product): CartProductPayload {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
    };
  }
}
