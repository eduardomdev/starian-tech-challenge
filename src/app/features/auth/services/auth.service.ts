import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { UserService } from '@shared/services/user.service';
import { TokenService } from '@core/tokens/token.service';
import { APP_ROUTES } from '@core/constants/app-routes.constant';
import { CreateUserPayload, LoginPayload } from '@shared/interfaces/auth.interface';
import { nextUserId } from '@shared/utils/storage-id';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userService = inject(UserService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly registerLoading = signal(false);
  readonly loginLoading = signal(false);
  readonly loginError = signal(false);

  register(data: Omit<CreateUserPayload, 'id'>): void {
    this.registerLoading.set(true);
    this.userService
      .register({ ...data, id: nextUserId() })
      .pipe(
        tap(() => {
          this.toastr.success('Usuário cadastrado com sucesso.');
          this.router.navigate([APP_ROUTES.login]);
        }),
        catchError(() => {
          this.toastr.error('Erro ao cadastrar usuário. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.registerLoading.set(false)),
      )
      .subscribe();
  }

  logout(): void {
    this.tokenService.removeToken();
    this.router.navigate([APP_ROUTES.login]);
  }

  login(data: LoginPayload): void {
    this.loginLoading.set(true);
    this.loginError.set(false);
    this.userService
      .login(data)
      .pipe(
        tap(({ token }) => {
          this.tokenService.setToken(token);
          this.router.navigate([APP_ROUTES.hub]);
        }),
        catchError(() => {
          this.loginError.set(true);
          return EMPTY;
        }),
        finalize(() => this.loginLoading.set(false)),
      )
      .subscribe();
  }
}
