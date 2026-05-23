import { computed, Injectable, signal } from '@angular/core';

const JWT_KEY = 'jwt';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly token = signal<string | null>(sessionStorage.getItem(JWT_KEY));

  readonly isAuthenticated = computed(() => !!this.token());
  readonly userId = computed(() => this.parseUserId(this.token()));

  setToken(token: string): void {
    sessionStorage.setItem(JWT_KEY, token);
    this.token.set(token);
  }

  removeToken(): void {
    sessionStorage.removeItem(JWT_KEY);
    this.token.set(null);
  }

  getToken(): string | null {
    return this.token();
  }

  private parseUserId(token: string | null): number | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return typeof payload['sub'] === 'number' ? payload['sub'] : null;
    } catch {
      return null;
    }
  }
}