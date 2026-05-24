import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { TokenService } from '@core/tokens/token.service';
import type { CreateUserPayload, CreateUserResponse, LoginPayload, LoginResponse } from '../interfaces/auth.interface';
import type { User, UpdateUserPayload } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);

  readonly users = httpResource<User[]>(() => `${environment.starianHubApi}/users`);

  readonly currentUser = httpResource<User>(() => {
    const id = this.tokenService.userId();
    return `${environment.starianHubApi}/users/${id}`;
  });

  register(data: CreateUserPayload): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${environment.starianHubApi}/users`, data);
  }

  login(data: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.starianHubApi}/auth/login`, data);
  }

  addUser(payload: CreateUserPayload): Observable<User> {
    return this.http.post<User>(`${environment.starianHubApi}/users`, payload);
  }

  updateUser(id: number, payload: UpdateUserPayload): Observable<User> {
    return this.http.put<User>(`${environment.starianHubApi}/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${environment.starianHubApi}/users/${id}`);
  }
}
