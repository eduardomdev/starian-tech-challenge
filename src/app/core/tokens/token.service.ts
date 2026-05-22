import { Injectable } from '@angular/core';

const JWT_KEY = 'jwt';

@Injectable({ providedIn: 'root' })
export class TokenService {
  setToken(token: string): void {
    sessionStorage.setItem(JWT_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(JWT_KEY);
  }

  removeToken(): void {
    sessionStorage.removeItem(JWT_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
