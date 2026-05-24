import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent } from '@shared/components/atoms/icon/icon';

@Component({
  selector: 'str-quantity-toggle',
  templateUrl: './str-quantity-toggle.component.html',
  styleUrl: './str-quantity-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': '"Quantidade de " + label()',
  },
  imports: [IconComponent],
})
export class StrQuantityToggleComponent {
  readonly quantity = input.required<number>();
  readonly label = input.required<string>();
  readonly increase = output<void>();
  readonly decrease = output<void>();
}
