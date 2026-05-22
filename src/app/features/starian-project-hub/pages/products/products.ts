import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TableComponent } from '@shared/components/organisms/str-table/str-table';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { TagComponent } from '@shared/components/atoms/str-tag/str-tag';
import { ProductRatingComponent } from './components/product-rating/product-rating';
import { StrSortDirective } from '@shared/directives/str-sort/str-sort.directive';
import { StrSortGroupDirective } from '@shared/directives/str-sort/str-sort-group';
import { SortService } from '@shared/directives/str-sort/str-sort.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductAddModalComponent } from './components/product-add-modal/product-add-modal';
import { ProductEditModalComponent } from './components/product-edit-modal/product-edit-modal';
import { ProductDeleteModalComponent } from './components/product-delete-modal/product-delete-modal';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { StrInputComponent } from '@shared/components/atoms/str-input/str-input.component';
import { StrMultiSelectComponent } from '@shared/components/atoms/str-multi-select/str-multi-select.component';
import { FilterProductsService } from '../../services/filter-products.service';

import type { Product } from '../../../../shared/interfaces/products.interface';
import { ProductsService } from '@shared/services/products.service';
import { PRODUCTS_TAG_CONFIG } from '../../../../core/constants/tag-products.constant';
import { StrTooltipDirective } from '@shared/directives/str-tooltip/str-tooltip.directive';

@Component({
  selector: 'app-products-page',
  imports: [
    TableComponent,
    CurrencyPipe,
    IconComponent,
    TagComponent,
    ProductRatingComponent,
    StrSortDirective,
    StrSortGroupDirective,
    StrTooltipDirective,
    StrButtonComponent,
    StrInputComponent,
    StrMultiSelectComponent,
  ],
  providers: [SortService],
  templateUrl: './products.html',
  styleUrl: './products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPageComponent {
  private readonly productsService = inject(ProductsService);
  private readonly filterService = inject(FilterProductsService);
  private readonly dialogService = inject(DialogService);

  protected readonly sortService = inject(SortService);
  protected readonly tagConfig = signal(PRODUCTS_TAG_CONFIG);

  protected readonly loading = computed(() => this.productsService.products.isLoading());
  protected readonly error = computed(() => this.productsService.products.error() !== undefined);

  protected readonly filterText = this.filterService.filterText;
  protected readonly filterCategories = this.filterService.filterCategories;
  protected readonly availableCategories = this.filterService.availableCategories;
  protected readonly hasActiveFilters = this.filterService.hasActiveFilters;

  protected readonly products = computed(() =>
    this.sortService.sort(this.filterService.filteredProducts()),
  );

  protected readonly trackById = (_: number, item: Product) => item.id;

  protected clearTextFilter(): void {
    this.filterService.clearTextFilter();
  }

  protected openAddModal(): void {
    this.dialogService.open(ProductAddModalComponent, {
      width: '560px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
    });
  }

  protected openEditModal(product: Product): void {
    this.dialogService.open(ProductEditModalComponent, {
      width: '560px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: product,
    });
  }

  protected openDeleteModal(product: Product): void {
    this.dialogService.open(ProductDeleteModalComponent, {
      width: '420px',
      modal: true,
      draggable: false,
      resizable: false,
      focusOnShow: true,
      data: product,
    });
  }
}
