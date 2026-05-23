import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-top-rated-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <ul class="product-list" aria-label="Carregando produtos melhor avaliados" aria-busy="true">
      @for (item of items; track item) {
        <li class="product-item">
          <str-skeleton width="20px" height="20px" radius="50%" />
          <str-skeleton width="44px" height="44px" radius="8px" />
          <div class="product-info">
            <str-skeleton width="65%" height="13px" />
            <str-skeleton width="45%" height="12px" />
          </div>
          <str-skeleton width="56px" height="13px" />
        </li>
      }
    </ul>
  `,
  styles: `
    :host { display: block; }

    .product-list {
      display: flex;
      flex-direction: column;
      gap: 0;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .product-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      &:first-child {
        padding-top: 0;
      }
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRatedSkeletonComponent {
  protected readonly items = [1, 2, 3, 4, 5];
}
