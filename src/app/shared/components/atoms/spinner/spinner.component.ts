import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { createSizeComputed, type SizeVariant } from '../../../utils/size-config';

@Component({
	selector: 'str-spinner',
	imports: [],
	templateUrl: './spinner.component.html',
	styleUrl: './spinner.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
	public colorSpinner = input<string>('currentColor');
	public size = input<SizeVariant>('md');

	protected readonly sizePx = createSizeComputed(this.size, {
		sm: '16px',
		md: '24px',
		lg: '40px',
	});
}
