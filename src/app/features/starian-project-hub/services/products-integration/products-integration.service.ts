import { inject, Injectable, signal } from '@angular/core';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { ProductsService } from '@shared/services/products.service';
import type { Product } from '@shared/interfaces/products.interface';


@Injectable({ providedIn: 'root' })
export class ProductsIntegrationService {
  private readonly productsService = inject(ProductsService);
  private readonly toastr = inject(ToastrService);

  readonly addLoading = signal(false);
  readonly updateLoading = signal(false);
  readonly deleteLoading = signal(false);

  add(product: Omit<Product, 'id'>, onSuccess: (created: Product) => void): void {
    this.addLoading.set(true);
    this.productsService
      .addProduct(product)
      .pipe(
        tap((created) => {
          this.toastr.success('Produto adicionado com sucesso.');
          onSuccess(created);
        }),
        catchError(() => {
          this.toastr.error('Erro ao adicionar produto. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.addLoading.set(false)),
      )
      .subscribe();
  }

  update(product: Product, onSuccess: (updated: Product) => void): void {
    this.updateLoading.set(true);
    this.productsService
      .updateProduct(product.id, product)
      .pipe(
        tap((updated) => {
          this.toastr.success('Produto atualizado com sucesso.');
          onSuccess(updated);
        }),
        catchError(() => {
          this.toastr.error('Erro ao atualizar produto. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.updateLoading.set(false)),
      )
      .subscribe();
  }

  delete(id: number, onSuccess: () => void): void {
    this.deleteLoading.set(true);
    this.productsService
      .deleteProduct(id)
      .pipe(
        tap(() => {
          this.toastr.success('Produto excluído com sucesso.');
          onSuccess();
        }),
        catchError(() => {
          this.toastr.error('Erro ao excluir produto. Tente novamente.');
          return EMPTY;
        }),
        finalize(() => this.deleteLoading.set(false)),
      )
      .subscribe();
  }
}
