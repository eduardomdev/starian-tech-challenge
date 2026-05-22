import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastrService } from './toastr.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'str-toastr',
  templateUrl: './toastr.component.html',
  styleUrl: './toastr.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
})
export class ToastrComponent {
  protected readonly toastr = inject(ToastrService);
}
