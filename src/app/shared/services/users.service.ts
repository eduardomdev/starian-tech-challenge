import { inject, Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import type { User, UpdateUserPayload } from '../interfaces/user.interface';
import type { CreateUserPayload } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  readonly users = httpResource<User[]>(() => `${environment.starianHubApi}/users`);

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
