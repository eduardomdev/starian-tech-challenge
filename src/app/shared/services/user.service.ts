import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import type { CreateUserPayload, CreateUserResponse, LoginPayload, LoginResponse } from '../interfaces/auth.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  register(data: CreateUserPayload): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${environment.starianHubApi}/users`, data);
  }

  login(data: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.starianHubApi}/auth/login`, data);
  }
}
