import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-user-edit-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <div class="skeleton-form" aria-label="Carregando formulário" aria-busy="true">
      <div class="skeleton-header">
        <str-skeleton height="22px" width="140px" />
        <str-skeleton height="14px" width="240px" />
      </div>

      <div class="skeleton-fields">
        @for (i of fields; track i) {
          <div class="skeleton-field">
            <str-skeleton height="13px" width="80px" />
            <str-skeleton height="38px" width="100%" radius="6px" />
          </div>
        }
      </div>

      <div class="skeleton-actions">
        <str-skeleton height="38px" width="96px" radius="6px" />
        <str-skeleton height="38px" width="128px" radius="6px" />
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }

    .skeleton-form {
      display: flex;
      flex-direction: column;
      padding: 4px 0;
    }

    .skeleton-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 24px;
    }

    .skeleton-fields {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 24px;
    }

    .skeleton-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .skeleton-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditSkeletonComponent {
  protected readonly fields = [1, 2, 3];
}
