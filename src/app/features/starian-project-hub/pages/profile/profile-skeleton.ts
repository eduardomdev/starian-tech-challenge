import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StrSkeletonComponent } from '@shared/components/atoms/str-skeleton/str-skeleton';

@Component({
  selector: 'app-profile-skeleton',
  imports: [StrSkeletonComponent],
  template: `
    <div class="identity">
      <str-skeleton class="avatar" width="56px" height="56px" radius="50%" />
      <div class="identity-info">
        <str-skeleton width="100px" height="18px" />
        <str-skeleton width="148px" height="14px" />
      </div>
    </div>

    <div class="divider"></div>

    <div class="form">
      <div class="grid">
        @for (i of items; track i) {
          <div class="input-item">
            <str-skeleton width="56px" height="14px" />
            <str-skeleton height="40px" />
          </div>
        }
      </div>
      <div class="actions">
        <str-skeleton width="148px" height="40px" radius="6px" />
        <str-skeleton width="168px" height="40px" radius="6px" />
      </div>
    </div>
  `,
  styles: `
    :host { display: contents; }

    .identity {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
    }

    .avatar { flex-shrink: 0; }

    .identity-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .divider {
      height: 1px;
      background: #f0f0f0;
    }

    .form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .input-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSkeletonComponent {
  protected readonly items = [1, 2, 3];
}
