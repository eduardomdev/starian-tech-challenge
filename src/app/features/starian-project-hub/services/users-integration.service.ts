import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { UsersService } from '@shared/services/users.service';
import { nextUserId } from '@shared/utils/storage-id';
import type { User, UpdateUserPayload } from '@shared/interfaces/user.interface';
import type { CreateUserPayload } from '@shared/interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class UsersIntegrationService {
  private readonly usersService = inject(UsersService);
  private readonly toastr = inject(ToastrService);

  readonly addLoading = signal(false);
  readonly updateLoading = signal(false);
  readonly deleteLoading = signal(false);

  add(payload: Omit<CreateUserPayload, 'id'>, onSuccess: (created: User) => void): void {
    this.addLoading.set(true);
    this.usersService
      .addUser({ ...payload, id: nextUserId() })
      .pipe(
        tap((created) => {
          this.toastr.success('Usuário adicionado com sucesso.');
          onSuccess(created);
        }),
        catchError(() => {
          this.toastr.error('Erro ao adicionar usuário. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.addLoading.set(false)),
      )
      .subscribe();
  }

  update(id: number, payload: UpdateUserPayload, onSuccess: (updated: User) => void): void {
    this.updateLoading.set(true);
    this.usersService
      .updateUser(id, payload)
      .pipe(
        tap((updated) => {
          this.toastr.success('Usuário atualizado com sucesso.');
          onSuccess(updated);
        }),
        catchError(() => {
          this.toastr.error('Erro ao atualizar usuário. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.updateLoading.set(false)),
      )
      .subscribe();
  }

  delete(id: number, onSuccess: () => void): void {
    this.deleteLoading.set(true);
    this.usersService
      .deleteUser(id)
      .pipe(
        tap(() => {
          this.toastr.success('Usuário excluído com sucesso.');
          onSuccess();
        }),
        catchError(() => {
          this.toastr.error('Erro ao excluir usuário. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.deleteLoading.set(false)),
      )
      .subscribe();
  }
}
