import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { StatsCardComponent } from '../../../../shared/components/molecules/str-stats-card/str-stats-card';
import { TopRatedProductsComponent } from './components/top-rated-products/top-rated-products';
import { ByCategoryComponent } from './components/by-category/by-category';
import { ProductsService } from '@shared/services/products.service';
import type { StatCard } from '@shared/interfaces/stats-card.interface';
import { computeProductStats, type ProductStats } from '@shared/helpers/product-stats.helper';
import { STAT_CARDS } from '@core/constants/stat-cards.constant';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatsCardComponent, TopRatedProductsComponent, ByCategoryComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly productsService = inject(ProductsService);

  private readonly products = computed(() => this.productsService.products.value() ?? []);
  protected readonly loading = this.productsService.products.isLoading;

  protected readonly stats = computed<StatCard[]>(() => {
    const values = computeProductStats(this.products());
    return STAT_CARDS.map((card) => ({ ...card, value: values[card.key as keyof ProductStats] ?? '-' }));
  });

  ngOnInit(): void {
    this.productsService.products.reload();
  }
}