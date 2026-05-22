import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { StatsCardComponent } from '../../../../shared/components/molecules/str-stats-card/str-stats-card';
import type { StatCard } from '@shared/interfaces/stats-card.interface';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatsCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly stats = signal<StatCard[]>([
    {
      title: 'Total Products',
      value: '20',
      description: 'In catalog',
      iconName: 'deployed_code',
      iconColor: '#7c3aed',
      iconBgColor: '#ede9fe',
    },
    {
      title: 'Categories',
      value: '4',
      description: 'Product types',
      iconName: 'sell',
      iconColor: '#16a34a',
      iconBgColor: '#dcfce7',
    },
    {
      title: 'Average Price',
      value: '$162.05',
      description: 'Across all products',
      iconName: 'attach_money',
      iconColor: '#d97706',
      iconBgColor: '#fef3c7',
    },
  ]);
}
