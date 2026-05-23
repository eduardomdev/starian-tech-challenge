import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { UserService } from '@shared/services/user.service';
import { TokenService } from '@core/tokens/token.service';
import { APP_ROUTES } from '@core/constants/app-routes.constant';
import type { UpdateUserPayload, User } from '@shared/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserIntegrationService {
  private readonly userService = inject(UserService);
  private readonly tokenService = inject(TokenService);
  private readonly toastr = inject(ToastrService);
  private readonly router = inject(Router);

  readonly updateLoading = signal(false);
  readonly deleteLoading = signal(false);

  update(id: number, payload: UpdateUserPayload, onSuccess: (updated: User) => void): void {
    this.updateLoading.set(true);
    this.userService
      .updateUser(id, payload)
      .pipe(
        tap((updated) => {
          this.toastr.success('Perfil atualizado com sucesso.');
          onSuccess(updated);
        }),
        catchError(() => {
          this.toastr.error('Erro ao atualizar perfil. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.updateLoading.set(false)),
      )
      .subscribe();
  }

  delete(id: number, onSuccess?: () => void): void {
    this.deleteLoading.set(true);
    this.userService
      .deleteUser(id)
      .pipe(
        tap(() => {
          this.toastr.success('Conta excluída com sucesso.');
          onSuccess?.();
          this.tokenService.removeToken();
          this.router.navigate([APP_ROUTES.login]);
        }),
        catchError(() => {
          this.toastr.error('Erro ao excluir conta. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.deleteLoading.set(false)),
      )
      .subscribe();
  }
}
