import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'str-skeleton',
  template: `
    <span
      class="str-skeleton"
      [style.width]="width()"
      [style.height]="height()"
      [style.border-radius]="radius()"
      aria-hidden="true"
    ></span>
  `,
  styles: `
    :host {
      display: block;
      flex-shrink: 0;
    }

    .str-skeleton {
      display: block;
      background: linear-gradient(
        90deg,
        #f0f0f0 25%,
        #e4e4e4 50%,
        #f0f0f0 75%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.6s ease-in-out infinite;
    }

    @keyframes skeleton-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
  host: {
    '[style.width]':  'width()',
    '[style.height]': 'height()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrSkeletonComponent {
  readonly height = input<string>('16px');
  readonly width  = input<string>('100%');
  readonly radius = input<string>('4px');
}
