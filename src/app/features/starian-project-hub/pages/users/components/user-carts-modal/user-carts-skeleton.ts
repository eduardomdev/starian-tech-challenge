import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-user-carts-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <div class="skeleton-list" aria-label="Carregando carrinhos do usuário" aria-busy="true">
      @for (i of items; track i) {
        <div class="skeleton-row" aria-hidden="true">
          <str-skeleton height="14px" width="40px" />
          <str-skeleton height="14px" width="90px" />
          <str-skeleton height="14px" width="80px" />
          <str-skeleton height="14px" width="64px" />
          <div class="skeleton-actions">
            <str-skeleton height="32px" width="32px" radius="6px" />
            <str-skeleton height="32px" width="32px" radius="6px" />
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }

    .skeleton-list {
      display: flex;
      flex-direction: column;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }

    .skeleton-row {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }
    }

    .skeleton-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCartsSkeletonComponent {
  protected readonly items = [1, 2, 3];
}
