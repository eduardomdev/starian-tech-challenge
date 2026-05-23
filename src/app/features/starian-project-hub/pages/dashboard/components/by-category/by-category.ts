import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { IconComponent } from '@shared/components/atoms/icon/icon';
import { ByCategorySkeletonComponent } from './by-category-skeleton';
import { ProductsService } from '@shared/services/products.service';
import { PRODUCTS_TAG_CONFIG } from '@core/constants/tag-products.constant';
import { CHART_COLORS, CHART_FALLBACK_COLOR, CHART_VIEW } from '@core/constants/by-category-chart.constant';

@Component({
  selector: 'app-by-category',
  imports: [NgxChartsModule, ByCategorySkeletonComponent, IconComponent],
  templateUrl: './by-category.html',
  styleUrl: './by-category.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCategoryComponent {
  private readonly productsService = inject(ProductsService);

  protected readonly loading = this.productsService.products.isLoading;
  protected readonly chartView = computed<[number, number]>(() => [...CHART_VIEW]);

  protected readonly categoryStats = computed(() => {
    const products = this.productsService.products.value() ?? [];
    const total = products.length;

    const grouped = products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, count]) => ({
      key,
      label: PRODUCTS_TAG_CONFIG[key]?.label ?? key,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
      color: CHART_COLORS[key] ?? CHART_FALLBACK_COLOR,
    }));
  });

  protected readonly chartData = computed(() =>
    this.categoryStats().map(({ label, count }) => ({ name: label, value: count })),
  );

  protected readonly colorScheme = computed(() => ({
    name: 'categories',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: this.categoryStats().map(({ color }) => color),
  }));
}