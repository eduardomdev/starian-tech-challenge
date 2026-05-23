import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductsService } from '@shared/services/products.service';
import { PRODUCTS_TAG_CONFIG } from '@core/constants/tag-products.constant';
import type { Product } from '@shared/interfaces/products.interface';
import type { StrMultiSelectOption } from '@shared/components/atoms/str-multi-select/str-multi-select.component';

@Injectable({ providedIn: 'root' })
export class FilterProductsService {
  private readonly productsService = inject(ProductsService);

  readonly filterText = signal('');
  readonly filterCategories = signal<string[]>([]);

  readonly availableCategories = computed<StrMultiSelectOption[]>(() => {
    const products = this.productsService.products.value() ?? [];
    const seen = new Set(products.map(({ category }) => category));

    return [...seen].map((category) => ({
      value: category,
      label: PRODUCTS_TAG_CONFIG[category]?.label ?? category,
    }));
  });

  readonly filteredProducts = computed<Product[]>(() => {
    const products = this.productsService.products.value() ?? [];
    const text = this.filterText().trim().toLowerCase();
    const categories = new Set(this.filterCategories());

    if (!text && categories.size === 0) return products;

    return products.filter((p) =>
      this.matchesText(p, text) && this.matchesCategories(p, categories),
    );
  });

  readonly hasActiveFilters = computed(
    () => this.filterText().trim().length > 0 || this.filterCategories().length > 0,
  );

  clearFilters(): void {
    this.filterText.set('');
    this.filterCategories.set([]);
  }

  private matchesText({ title, id }: Product, text: string): boolean {
    return !text || title.toLowerCase().includes(text) || String(id).includes(text);
  }

  private matchesCategories({ category }: Product, categories: Set<string>): boolean {
    return categories.size === 0 || categories.has(category);
  }
}