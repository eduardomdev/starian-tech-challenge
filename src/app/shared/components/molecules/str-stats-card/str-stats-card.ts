import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';
import { StatsCardSkeletonComponent } from './stats-card-skeleton';

@Component({
  selector: 'str-stats-card',
  imports: [IconComponent, StatsCardSkeletonComponent],
  templateUrl: './str-stats-card.html',
  styleUrl: './str-stats-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly description = input.required<string>();
  readonly iconName = input.required<string>();
  readonly iconColor = input<string>('#7c3aed');
  readonly iconBgColor = input<string>('#ede9fe');
  readonly loading = input<boolean>(false);
}
