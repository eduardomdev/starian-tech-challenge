import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'tr[appUsersTableRowSkeleton]',
  imports: [StrSkeletonComponent],
  template: `
    <td class="col-id"><str-skeleton height="14px" width="28px" /></td>
    <td class="col-name"><str-skeleton height="14px" width="130px" /></td>
    <td class="col-username"><str-skeleton height="14px" width="90px" /></td>
    <td class="col-email"><str-skeleton height="14px" width="160px" /></td>
    <td class="col-phone"><str-skeleton height="14px" width="110px" /></td>
    <td class="col-actions">
      <div class="actions-cell">
        <str-skeleton height="32px" width="32px" radius="6px" />
        <str-skeleton height="32px" width="32px" radius="6px" />
        <str-skeleton height="32px" width="32px" radius="6px" />
      </div>
    </td>
  `,
  styles: `
    td {
      padding: 12px 16px;
      vertical-align: middle;
      border-bottom: 1px solid #f3f4f6;
    }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
  host: {
    'aria-hidden': 'true',
    'class': 'skeleton-row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersTableRowSkeletonComponent {}
