import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-cart-add-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <div class="skeleton-list" aria-label="Carregando produtos disponíveis" aria-busy="true">
      @for (i of items; track i) {
        <div class="skeleton-item" aria-hidden="true">
          <str-skeleton width="40px" height="40px" radius="4px" />
          <div class="skeleton-info">
            <str-skeleton height="12px" width="160px" />
            <str-skeleton height="10px" width="90px" />
          </div>
          <str-skeleton height="30px" width="90px" radius="6px" />
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: contents; }

    .skeleton-list {
      display: flex;
      flex-direction: column;
    }

    .skeleton-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-bottom: 1px solid #f3f4f6;
      pointer-events: none;

      &:last-child {
        border-bottom: none;
      }
    }

    .skeleton-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartAddSkeletonComponent {
  protected readonly items = [1, 2, 3];
}
