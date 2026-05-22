import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'str-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrl: './auth-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly ariaLabel = input.required<string>();
}
