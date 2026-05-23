import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'tr[appProductsTableRowSkeleton]',
  imports: [StrSkeletonComponent],
  template: `
    <td class="col-id"><str-skeleton height="14px" width="28px" /></td>
    <td class="col-product">
      <div class="product-cell">
        <str-skeleton height="48px" width="48px" radius="4px" />
        <div class="product-info">
          <str-skeleton height="14px" width="90%" />
          <str-skeleton height="12px" width="70%" />
        </div>
      </div>
    </td>
    <td class="col-category"><str-skeleton height="22px" width="108px" /></td>
    <td class="col-price"><str-skeleton height="14px" width="72px" /></td>
    <td class="col-rating"><str-skeleton height="14px" width="120px" /></td>
    <td class="col-actions">
      <div class="actions-cell">
        <str-skeleton height="32px" width="32px" radius="6px" />
        <str-skeleton height="32px" width="32px" radius="6px" />
      </div>
    </td>
  `,
  styles: `
    td {
      padding: 12px 16px;
      vertical-align: middle;
      border-bottom: 1px solid #f3f4f6;
    }

    .product-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
  host: {
    'aria-hidden': 'true',
    'class': 'skeleton-row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableRowSkeletonComponent {}
