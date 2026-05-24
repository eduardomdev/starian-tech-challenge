import { TokenService } from './token.service';

/**
 * TokenService não usa inject(), por isso pode ser instanciado diretamente.
 * Isso permite controlar o estado do sessionStorage antes da criação.
 */

function makeJwt(payload: Record<string, unknown>): string {
  const header  = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake_signature`;
}

describe('TokenService', () => {
  afterEach(() => sessionStorage.clear());

  // ── Inicialização ────────────────────────────────────────────────────────

  describe('inicialização via sessionStorage', () => {
    it('não está autenticado quando sessionStorage está vazio', () => {
      const svc = new TokenService();
      expect(svc.isAuthenticated()).toBe(false);
    });

    it('está autenticado quando há um token no sessionStorage ao iniciar', () => {
      sessionStorage.setItem('jwt', 'persisted-token');
      const svc = new TokenService();
      expect(svc.isAuthenticated()).toBe(true);
    });
  });

  // ── setToken ─────────────────────────────────────────────────────────────

  describe('setToken', () => {
    it('marca como autenticado imediatamente', () => {
      const svc = new TokenService();
      svc.setToken('my-token');
      expect(svc.isAuthenticated()).toBe(true);
    });

    it('persiste o token no sessionStorage', () => {
      const svc = new TokenService();
      svc.setToken('my-token');
      expect(sessionStorage.getItem('jwt')).toBe('my-token');
    });

    it('getToken() retorna o token atual', () => {
      const svc = new TokenService();
      svc.setToken('abc');
      expect(svc.getToken()).toBe('abc');
    });
  });

  // ── removeToken ──────────────────────────────────────────────────────────

  describe('removeToken', () => {
    it('desfaz a autenticação', () => {
      const svc = new TokenService();
      svc.setToken('my-token');
      svc.removeToken();
      expect(svc.isAuthenticated()).toBe(false);
    });

    it('remove o token do sessionStorage', () => {
      const svc = new TokenService();
      svc.setToken('my-token');
      svc.removeToken();
      expect(sessionStorage.getItem('jwt')).toBeNull();
    });

    it('getToken() retorna null após remoção', () => {
      const svc = new TokenService();
      svc.setToken('my-token');
      svc.removeToken();
      expect(svc.getToken()).toBeNull();
    });
  });

  // ── userId (parse JWT) ────────────────────────────────────────────────────

  describe('userId', () => {
    it('retorna null quando não há token', () => {
      expect(new TokenService().userId()).toBeNull();
    });

    it('extrai sub numérico do payload JWT', () => {
      const svc = new TokenService();
      svc.setToken(makeJwt({ sub: 42 }));
      expect(svc.userId()).toBe(42);
    });

    it('retorna null quando sub é string (não numérico)', () => {
      const svc = new TokenService();
      svc.setToken(makeJwt({ sub: 'usuario-123' }));
      expect(svc.userId()).toBeNull();
    });

    it('retorna null quando payload não tem campo sub', () => {
      const svc = new TokenService();
      svc.setToken(makeJwt({ name: 'sem-sub' }));
      expect(svc.userId()).toBeNull();
    });

    it('retorna null para token malformado (menos de 3 partes)', () => {
      const svc = new TokenService();
      svc.setToken('nao.e.um.jwt.valido.pois.tem.muitas.partes');
      // atob pode lançar, deve retornar null silenciosamente
      expect(() => svc.userId()).not.toThrow();
      expect(svc.userId()).toBeNull();
    });

    it('retorna null para payload base64 inválido', () => {
      const svc = new TokenService();
      svc.setToken('header.!@#$.signature');
      expect(svc.userId()).toBeNull();
    });
  });
});
