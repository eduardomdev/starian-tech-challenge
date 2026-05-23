import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-stats-card-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <str-skeleton width="55%" height="28px" radius="6px" />
    <str-skeleton width="70%" height="13px" radius="4px" />
  `,
  styles: `:host { display: contents; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardSkeletonComponent {}
