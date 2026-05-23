import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { TopRatedSkeletonComponent } from './top-rated-skeleton';
import { ProductRatingComponent } from '../../../products/components/product-rating/product-rating';
import { ProductsService } from '@shared/services/products.service';

const TOP_COUNT = 5;

@Component({
  selector: 'app-top-rated-products',
  imports: [CurrencyPipe, TopRatedSkeletonComponent, ProductRatingComponent, IconComponent],
  templateUrl: './top-rated-products.html',
  styleUrl: './top-rated-products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRatedProductsComponent {
  private readonly productsService = inject(ProductsService);

  protected readonly loading = this.productsService.products.isLoading;

  protected readonly topProducts = computed(() => {
    const products = this.productsService.products.value() ?? [];
    return [...products]
      .sort((a, b) => b.rating.rate - a.rating.rate || b.rating.count - a.rating.count)
      .slice(0, TOP_COUNT);
  });
}