import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrInputComponent } from '@shared/components/atoms/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { UserIntegrationService } from '../../../../services/user-integration/user-integration.service';
import type { User } from '@shared/interfaces/user.interface';

interface UserEditModel {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.html',
  styleUrl: './user-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, StrInputComponent, StrButtonComponent],
})
export class UserEditModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly integrationService = inject(UserIntegrationService);

  protected readonly user = this.config.data as User;
  protected readonly updateLoading = this.integrationService.updateLoading;

  protected readonly editModel = signal<UserEditModel>({
    username: this.user.username,
    email: this.user.email,
    password: this.user.password,
  });

  protected readonly editForm = form(
    this.editModel,
    (p) => {
      required(p.username, { message: 'Username é obrigatório.' });
      maxLength(p.username, 60, { message: 'Username pode ter no máximo 60 caracteres.' });
      required(p.email, { message: 'E-mail é obrigatório.' });
      maxLength(p.email, 100, { message: 'E-mail pode ter no máximo 100 caracteres.' });
      required(p.password, { message: 'Senha é obrigatória.' });
      maxLength(p.password, 100, { message: 'Senha pode ter no máximo 100 caracteres.' });
    },
    {
      submission: {
        action: async (f) => {
          const { username, email, password } = f().value();
          this.integrationService.update(
            this.user.id,
            { username, email, password },
            (updated) => this.ref.close(updated),
          );
        },
      },
    },
  );

  protected cancel(): void {
    this.ref.close();
  }
}
