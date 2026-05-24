import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '@shared/services/user.service';
import { TokenService } from '@core/tokens/token.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import { Router } from '@angular/router';
import type { LoginResponse, CreateUserResponse } from '@shared/interfaces/auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: { register: jest.Mock; login: jest.Mock };
  let mockTokenService: { setToken: jest.Mock; removeToken: jest.Mock; userId: jest.Mock };
  let mockToastr: { success: jest.Mock; error: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    sessionStorage.clear();

    mockUserService = { register: jest.fn(), login: jest.fn() };
    mockTokenService = { setToken: jest.fn(), removeToken: jest.fn(), userId: jest.fn().mockReturnValue(null) };
    mockToastr = { success: jest.fn(), error: jest.fn() };
    mockRouter = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => sessionStorage.clear());

  // ── logout() ─────────────────────────────────────────────────────────────

  it('logout remove o token e navega para /login', () => {
    service.logout();
    expect(mockTokenService.removeToken).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ── login() ───────────────────────────────────────────────────────────────

  it('login() define loginLoading=true enquanto a requisição está pendente', () => {
    const subject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(subject.asObservable());

    service.login({ username: 'user', password: 'pass' });
    expect(service.loginLoading()).toBe(true);
  });

  it('login() reseta loginError antes de iniciar nova tentativa', () => {
    // 1) Provoca um erro para colocar loginError=true
    const failSubject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(failSubject.asObservable());
    service.login({ username: 'user', password: 'wrong' });
    failSubject.error(new Error('Unauthorized'));
    expect(service.loginError()).toBe(true); // confirmação do estado prévio

    // 2) Inicia nova tentativa e verifica que o erro foi limpo imediatamente
    const newSubject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(newSubject.asObservable());
    service.login({ username: 'user', password: 'pass' });
    expect(service.loginError()).toBe(false);
  });

  it('login() com sucesso: salva o token e navega para hub', () => {
    const subject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(subject.asObservable());

    service.login({ username: 'user', password: 'pass' });
    subject.next({ token: 'jwt-token-123' });
    subject.complete();

    expect(mockTokenService.setToken).toHaveBeenCalledWith('jwt-token-123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/starian-hub']);
  });

  it('login() com sucesso: loginLoading=false após finalizar', () => {
    const subject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(subject.asObservable());

    service.login({ username: 'user', password: 'pass' });
    subject.next({ token: 'abc' });
    subject.complete();

    expect(service.loginLoading()).toBe(false);
  });

  it('login() com erro: define loginError=true', () => {
    const subject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(subject.asObservable());

    service.login({ username: 'user', password: 'wrong' });
    subject.error(new Error('Unauthorized'));

    expect(service.loginError()).toBe(true);
  });

  it('login() com erro: loginLoading=false após finalizar', () => {
    const subject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(subject.asObservable());

    service.login({ username: 'user', password: 'wrong' });
    subject.error(new Error('Unauthorized'));

    expect(service.loginLoading()).toBe(false);
  });

  it('login() com erro: não navega nem salva token', () => {
    const subject = new Subject<LoginResponse>();
    mockUserService.login.mockReturnValue(subject.asObservable());

    service.login({ username: 'user', password: 'wrong' });
    subject.error(new Error('Unauthorized'));

    expect(mockTokenService.setToken).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // ── register() ────────────────────────────────────────────────────────────

  it('register() define registerLoading=true enquanto a requisição está pendente', () => {
    const subject = new Subject<CreateUserResponse>();
    mockUserService.register.mockReturnValue(subject.asObservable());

    service.register({ username: 'user', email: 'u@e.com', password: '123' });
    expect(service.registerLoading()).toBe(true);
  });

  it('register() com sucesso: mostra toastr de sucesso e navega para /login', () => {
    const subject = new Subject<CreateUserResponse>();
    mockUserService.register.mockReturnValue(subject.asObservable());

    service.register({ username: 'user', email: 'u@e.com', password: '123' });
    subject.next({ id: 1, username: 'user', email: 'u@e.com', password: '123' });
    subject.complete();

    expect(mockToastr.success).toHaveBeenCalledWith('Usuário cadastrado com sucesso.');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('register() com sucesso: registerLoading=false após finalizar', () => {
    const subject = new Subject<CreateUserResponse>();
    mockUserService.register.mockReturnValue(subject.asObservable());

    service.register({ username: 'user', email: 'u@e.com', password: '123' });
    subject.next({ id: 1, username: 'user', email: 'u@e.com', password: '123' });
    subject.complete();

    expect(service.registerLoading()).toBe(false);
  });

  it('register() com erro: mostra toastr de erro', () => {
    const subject = new Subject<CreateUserResponse>();
    mockUserService.register.mockReturnValue(subject.asObservable());

    service.register({ username: 'user', email: 'u@e.com', password: '123' });
    subject.error(new Error('Conflict'));

    expect(mockToastr.error).toHaveBeenCalledWith('Erro ao cadastrar usuário. Tente novamente.');
  });

  it('register() com erro: registerLoading=false após finalizar', () => {
    const subject = new Subject<CreateUserResponse>();
    mockUserService.register.mockReturnValue(subject.asObservable());

    service.register({ username: 'user', email: 'u@e.com', password: '123' });
    subject.error(new Error('Conflict'));

    expect(service.registerLoading()).toBe(false);
  });

  it('register() com erro: não navega para /login', () => {
    const subject = new Subject<CreateUserResponse>();
    mockUserService.register.mockReturnValue(subject.asObservable());

    service.register({ username: 'user', email: 'u@e.com', password: '123' });
    subject.error(new Error('Conflict'));

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
