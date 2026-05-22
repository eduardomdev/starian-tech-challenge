import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { SpinnerComponent } from '../spinner/spinner.component';
import { type SizeVariant } from '../../../utils/size-config';

type ButtonVariant = 'primary' | 'secondary';

@Component({
  selector: 'str-button',
  templateUrl: './str-button.component.html',
  styleUrl: './str-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, SpinnerComponent],
})
export class StrButtonComponent {
  readonly size = input<SizeVariant>('md');
  readonly variant = input<ButtonVariant>('primary');
  readonly iconName = input<string>('');
  readonly iconPosition = input<'left' | 'right'>('right');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly loading = input<boolean>(false);

  protected readonly classes = computed(() =>
    `str-button str-button--${this.size()} str-button--${this.variant()}`
  );
}
