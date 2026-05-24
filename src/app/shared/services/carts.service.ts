import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import type { Cart, CartPayload } from '../interfaces/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartsService {
  private readonly http = inject(HttpClient);
  private readonly _userId = signal<number | null>(null);

  readonly userCarts = httpResource<Cart[]>(() => {
    const userId = this._userId();
    if (!userId) return undefined;
    return `${environment.starianHubApi}/carts/user/${userId}`;
  });

  loadUserCarts(userId: number): void {
    this._userId.set(userId);
  }

  addCart(payload: CartPayload): Observable<Cart> {
    return this.http.post<Cart>(`${environment.starianHubApi}/carts`, payload);
  }

  updateCart(id: number, payload: CartPayload): Observable<Cart> {
    return this.http.put<Cart>(`${environment.starianHubApi}/carts/${id}`, payload);
  }

  deleteCart(id: number): Observable<Cart> {
    return this.http.delete<Cart>(`${environment.starianHubApi}/carts/${id}`);
  }
}
