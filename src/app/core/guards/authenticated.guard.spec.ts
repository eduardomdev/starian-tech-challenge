import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { authenticatedGuard } from './authenticated.guard';
import { TokenService } from '@core/tokens/token.service';

describe('authenticatedGuard', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => sessionStorage.clear());

  it('retorna true para usuário autenticado, permitindo acesso à rota', () => {
    tokenService.setToken('valid-token');
    const result = TestBed.runInInjectionContext(() =>
      authenticatedGuard({} as any, {} as any),
    );
    expect(result).toBe(true);
  });

  it('retorna UrlTree redirecionando para /login quando não autenticado', () => {
    const result = TestBed.runInInjectionContext(() =>
      authenticatedGuard({} as any, {} as any),
    );
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('redireciona para /login imediatamente após remoção do token', () => {
    tokenService.setToken('token');
    tokenService.removeToken();
    const result = TestBed.runInInjectionContext(() =>
      authenticatedGuard({} as any, {} as any),
    );
    expect(result).toBeInstanceOf(UrlTree);
  });
});
