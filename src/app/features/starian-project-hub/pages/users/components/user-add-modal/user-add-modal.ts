import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, maxLength, required } from '@angular/forms/signals';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { StrInputComponent } from '@shared/components/atoms/inputs/str-input/str-input.component';
import { StrButtonComponent } from '@shared/components/atoms/str-button/str-button.component';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { UserIntegrationService } from '../../../../services/user-integration/user-integration.service';
import { UserAddSkeletonComponent } from './user-add-skeleton';

interface UserAddModel {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-user-add-modal',
  templateUrl: './user-add-modal.html',
  styleUrl: './user-add-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, StrInputComponent, StrButtonComponent, UserAddSkeletonComponent],
})
export class UserAddModalComponent {
  private readonly ref = inject(DynamicDialogRef);
  private readonly toastr = inject(ToastrService);
  private readonly integrationService = inject(UserIntegrationService);

  protected readonly addLoading = this.integrationService.addLoading;

  protected readonly addModel = signal<UserAddModel>({
    username: '',
    email: '',
    password: '',
  });

  protected readonly addForm = form(
    this.addModel,
    (p) => {
      required(p.username, { message: 'Username é obrigatório.' });
      maxLength(p.username, 30, { message: 'Username pode ter no máximo 30 caracteres.' });
      required(p.email, { message: 'E-mail é obrigatório.' });
      email(p.email, { message: 'Informe um e-mail válido.' });
      maxLength(p.email, 100, { message: 'E-mail pode ter no máximo 100 caracteres.' });
      required(p.password, { message: 'Senha é obrigatória.' });
      maxLength(p.password, 64, { message: 'Senha pode ter no máximo 64 caracteres.' });
    },
    {
      submission: {
        action: async (f) => {
          const { username, email: userEmail, password } = f().value();
          this.integrationService.add(
            { username, email: userEmail, password },
            (created) => this.ref.close(created),
          );
        },
        onInvalid: () => {
          this.toastr.error('Por favor, corrija os erros no formulário.');
        },
      },
    },
  );

  protected cancel(): void {
    this.ref.close();
  }
}
