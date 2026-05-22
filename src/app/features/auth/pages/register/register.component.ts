import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormField, FormRoot, email, form, maxLength, required } from '@angular/forms/signals';
import { StrInputComponent } from '../../../../shared/components/atoms/str-input/str-input.component';
import { StrButtonComponent } from '../../../../shared/components/atoms/str-button/str-button.component';
import { AuthCardComponent } from '../../../../shared/components/atoms/auth-card/auth-card.component';

import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import type { RegisterModel } from '@shared/interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, StrInputComponent, StrButtonComponent, AuthCardComponent],
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  protected readonly isLoading = this.authService.registerLoading;

  protected readonly registerModel = signal<RegisterModel>({
    username: '',
    email: '',
    password: '',
  });

  protected readonly registerForm = form(this.registerModel, (p) => {
    required(p.username, { message: 'Usuário é obrigatório.' });
    maxLength(p.username, 30, { message: 'Usuário pode ter no máximo 30 caracteres.' });
    required(p.email, { message: 'E-mail é obrigatório.' });
    email(p.email, { message: 'Informe um e-mail válido.' });
    maxLength(p.email, 100, { message: 'E-mail pode ter no máximo 100 caracteres.' });
    required(p.password, { message: 'Senha é obrigatória.' });
    maxLength(p.password, 64, { message: 'Senha pode ter no máximo 64 caracteres.' });
  },
  {
    submission: {
      action: async (f) => {
        this.authService.register(f().value());
      },
      onInvalid: () => {
        this.toastr.error('Por favor, corrija os erros no formulário.');
      },
    },
  });

  protected goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
