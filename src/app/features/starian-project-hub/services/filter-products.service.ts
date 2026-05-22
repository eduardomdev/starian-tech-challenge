import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductsService } from '@shared/services/products.service';
import { PRODUCTS_TAG_CONFIG } from '@core/constants/tag-products.constant';
import type { Product } from '@shared/interfaces/products.interface';
import type { StrMultiSelectOption } from '@shared/components/atoms/str-multi-select/str-multi-select.component';

/**
 * Encapsula a lógica de filtro de produtos.
 *
 * Em um cenário real, essa filtragem seria realizada no back-end
 * como parâmetros de query (e.g. GET /products?text=...&categories=...).
 * Como este é um teste técnico com dados mockados, a lógica foi
 * implementada no front-end mantendo a mesma separação de responsabilidades.
 */
@Injectable({ providedIn: 'root' })
export class FilterProductsService {
  private readonly productsService = inject(ProductsService);

  readonly filterText = signal('');
  readonly filterCategories = signal<string[]>([]);

  readonly availableCategories = computed<StrMultiSelectOption[]>(() => {
    const allProducts = this.productsService.products.value() ?? [];
    const seen = new Set<string>();
    const result: StrMultiSelectOption[] = [];

    for (const p of allProducts) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        result.push({
          value: p.category,
          label: PRODUCTS_TAG_CONFIG[p.category]?.label ?? p.category,
        });
      }
    }

    return result;
  });

  readonly filteredProducts = computed<Product[]>(() => {
    const rawProducts = this.productsService.products.value() ?? [];
    const text = this.filterText().toLowerCase().trim();
    const categories = this.filterCategories();

    return rawProducts.filter((p) => {
      const matchesText =
        !text ||
        p.title.toLowerCase().includes(text) ||
        String(p.id).includes(text);

      const matchesCategory =
        categories.length === 0 || categories.includes(p.category);

      return matchesText && matchesCategory;
    });
  });

  readonly hasActiveFilters = computed(
    () => this.filterText().trim().length > 0 || this.filterCategories().length > 0,
  );

  clearTextFilter(): void {
    this.filterText.set('');
  }
}
