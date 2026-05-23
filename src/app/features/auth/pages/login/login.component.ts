import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '@core/constants/app-routes.constant';
import { FormField, FormRoot, form, maxLength, required } from '@angular/forms/signals';
import { StrInputComponent } from '../../../../shared/components/atoms/str-input/str-input.component';
import { StrButtonComponent } from '../../../../shared/components/atoms/str-button/str-button.component';
import { AuthCardComponent } from '../../../../shared/components/atoms/auth-card/auth-card.component';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import type { LoginModel } from '@shared/interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormRoot, FormField, StrInputComponent, StrButtonComponent, AuthCardComponent],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  protected readonly isLoading = this.authService.loginLoading;
  protected readonly hasError = this.authService.loginError;

  protected readonly loginModel = signal<LoginModel>({
    username: '',
    password: '',
  });

  protected readonly loginForm = form(this.loginModel, (p) => {
    required(p.username, { message: 'Usuário é obrigatório.' });
    maxLength(p.username, 30, { message: 'Usuário pode ter no máximo 30 caracteres.' });
    required(p.password, { message: 'Senha é obrigatória.' });
    maxLength(p.password, 64, { message: 'Senha pode ter no máximo 64 caracteres.' });
  },
  {
    submission: {
      action: async (f) => {
        this.authService.login(f().value());
      },
      onInvalid: () => {
        this.toastr.error('Por favor, corrija os erros no formulário.');
      },
    },
  });

  protected goToRegister(): void {
    this.router.navigate([APP_ROUTES.register]);
  }
}
