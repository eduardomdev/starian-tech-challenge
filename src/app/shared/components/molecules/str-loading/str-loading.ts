import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

@Component({
	selector: 'str-loading',
	imports: [SpinnerComponent],
	templateUrl: './str-loading.html',
	styleUrl: './str-loading.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		role: 'status',
		'aria-live': 'polite',
	},
})
export class LoadingMoleculeComponent {
	public text = input('');
}
