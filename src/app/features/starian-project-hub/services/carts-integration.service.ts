import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { CartsService } from '@shared/services/carts.service';
import type { Cart, CartPayload } from '@shared/interfaces/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartsIntegrationService {
  private readonly cartsService = inject(CartsService);
  private readonly toastr = inject(ToastrService);

  readonly addLoading = signal(false);
  readonly updateLoading = signal(false);
  readonly deleteLoading = signal(false);

  add(payload: CartPayload, onSuccess: (cart: Cart) => void): void {
    this.addLoading.set(true);
    this.cartsService
      .addCart(payload)
      .pipe(
        tap((cart) => {
          this.toastr.success('Carrinho adicionado com sucesso.');
          onSuccess(cart);
        }),
        catchError(() => {
          this.toastr.error('Erro ao adicionar carrinho. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.addLoading.set(false)),
      )
      .subscribe();
  }

  update(id: number, payload: CartPayload, onSuccess: (cart: Cart) => void): void {
    this.updateLoading.set(true);
    this.cartsService
      .updateCart(id, payload)
      .pipe(
        tap((cart) => {
          this.toastr.success('Carrinho atualizado com sucesso.');
          onSuccess(cart);
        }),
        catchError(() => {
          this.toastr.error('Erro ao atualizar carrinho. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.updateLoading.set(false)),
      )
      .subscribe();
  }

  delete(id: number, onSuccess: () => void): void {
    this.deleteLoading.set(true);
    this.cartsService
      .deleteCart(id)
      .pipe(
        tap(() => {
          this.toastr.success('Carrinho excluído com sucesso.');
          onSuccess();
        }),
        catchError(() => {
          this.toastr.error('Erro ao excluir carrinho. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.deleteLoading.set(false)),
      )
      .subscribe();
  }
}
