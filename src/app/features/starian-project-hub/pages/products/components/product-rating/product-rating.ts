import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'product-rating',
  templateUrl: './product-rating.html',
  styleUrl: './product-rating.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRatingComponent {
  readonly rate = input.required<number>();
  readonly count = input.required<number>();

  protected readonly stars = computed(() =>
    Array.from({ length: 5 }, (_, i) => i < Math.round(this.rate()))
  );
}
