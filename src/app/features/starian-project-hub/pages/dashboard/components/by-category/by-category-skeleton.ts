import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-by-category-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <div class="skeleton-body" aria-label="Carregando gráfico de categorias" aria-busy="true">
      <str-skeleton width="200px" height="200px" radius="50%" />
      <div class="skeleton-legend">
        @for (item of items; track item) {
          <div class="skeleton-legend-item">
            <str-skeleton width="11px" height="11px" radius="50%" />
            <div class="skeleton-legend-text">
              <str-skeleton width="120px" height="16px" />
              <str-skeleton width="80px" height="14px" />
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }

    .skeleton-body {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 58px;
      flex: 1;
      min-height: 0;
    }

    .skeleton-legend {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
    }

    .skeleton-legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .skeleton-legend-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ByCategorySkeletonComponent {
  protected readonly items = [1, 2, 3, 4];
}
