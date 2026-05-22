import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BreadcrumbItem } from '../../../interfaces/breadcrumb.interface';

@Component({
  selector: 'str-breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrBreadcrumbComponent {
  public data = input<BreadcrumbItem[]>([]);
}
