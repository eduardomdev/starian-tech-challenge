import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import type { Product } from '../interfaces/products.interface';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  readonly products = httpResource<Product[]>(() => `${environment.starianHubApi}/products`);

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${environment.starianHubApi}/products`, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.starianHubApi}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.starianHubApi}/products/${id}`);
  }
}
