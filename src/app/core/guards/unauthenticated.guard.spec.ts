import { TestBed } from '@angular/core/testing';
import { provideRouter, Route, UrlSegment, UrlTree } from '@angular/router';
import { unauthenticatedGuard } from './unauthenticated.guard';
import { TokenService } from '@core/tokens/token.service';

const EMPTY_ROUTE: Route = {};
const EMPTY_SEGMENTS: UrlSegment[] = [];

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
      unauthenticatedGuard(EMPTY_ROUTE, EMPTY_SEGMENTS),
    );
    expect(result).toBe(true);
  });

  it('retorna UrlTree redirecionando para /starian-hub quando já autenticado', () => {
    tokenService.setToken('active-token');
    const result = TestBed.runInInjectionContext(() =>
      unauthenticatedGuard(EMPTY_ROUTE, EMPTY_SEGMENTS),
    );
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/starian-hub');
  });
});
