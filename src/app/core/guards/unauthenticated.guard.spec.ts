import { TestBed } from '@angular/core/testing';
import { provideRouter, UrlTree } from '@angular/router';
import { unauthenticatedGuard } from './unauthenticated.guard';
import { TokenService } from '@core/tokens/token.service';

describe('unauthenticatedGuard', () => {
  let tokenService: TokenService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => sessionStorage.clear());

  it('retorna true para usuário não autenticado, permitindo acesso a login/register', () => {
    const result = TestBed.runInInjectionContext(() =>
      unauthenticatedGuard({} as any, {} as any),
    );
    expect(result).toBe(true);
  });

  it('retorna UrlTree redirecionando para /starian-hub quando já autenticado', () => {
    tokenService.setToken('active-token');
    const result = TestBed.runInInjectionContext(() =>
      unauthenticatedGuard({} as any, {} as any),
    );
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/starian-hub');
  });
});
