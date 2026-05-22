import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';

@Component({
	selector: 'str-stats-card',
	imports: [IconComponent],
	templateUrl: './str-stats-card.html',
	styleUrl: './str-stats-card.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsCardComponent {
	public title = input.required<string>();
	public value = input.required<string>();
	public description = input.required<string>();
	public iconName = input.required<string>();
	public iconColor = input<string>('#7c3aed');
	public iconBgColor = input<string>('#ede9fe');
}
