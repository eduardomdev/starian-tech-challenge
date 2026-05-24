import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { UserIntegrationService } from './user-integration.service';
import { UserService } from '@shared/services/user.service';
import { TokenService } from '@core/tokens/token.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import type { User } from '@shared/interfaces/user.interface';

const USER: User = {
  id: 7,
  username: 'jsilva',
  email: 'j@silva.com',
  password: 'secret',
};

describe('UserIntegrationService', () => {
  let service: UserIntegrationService;
  let mockUserService: { updateUser: jest.Mock; deleteUser: jest.Mock };
  let mockTokenService: { removeToken: jest.Mock };
  let mockToastr: { success: jest.Mock; error: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    mockUserService = { updateUser: jest.fn(), deleteUser: jest.fn() };
    mockTokenService = { removeToken: jest.fn() };
    mockToastr = { success: jest.fn(), error: jest.fn() };
    mockRouter = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [
        UserIntegrationService,
        { provide: UserService, useValue: mockUserService },
        { provide: TokenService, useValue: mockTokenService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(UserIntegrationService);
  });

  // ── update() ──────────────────────────────────────────────────────────────

  it('update() define updateLoading=true enquanto pendente', () => {
    const subject = new Subject<User>();
    mockUserService.updateUser.mockReturnValue(subject.asObservable());
    service.update(7, { username: 'novo', email: 'n@e.com', password: '123' }, jest.fn());
    expect(service.updateLoading()).toBe(true);
  });

  it('update() com sucesso: chama onSuccess com o usuário atualizado', () => {
    const subject = new Subject<User>();
    const updatedUser = { ...USER, username: 'novo' };
    mockUserService.updateUser.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.update(7, { username: 'novo', email: 'j@silva.com', password: 'secret' }, onSuccess);

    subject.next(updatedUser);
    subject.complete();

    expect(onSuccess).toHaveBeenCalledWith(updatedUser);
  });

  it('update() com sucesso: exibe toastr de sucesso e reset loading', () => {
    const subject = new Subject<User>();
    mockUserService.updateUser.mockReturnValue(subject.asObservable());
    service.update(7, { username: 'x', email: 'x@e.com', password: 'p' }, jest.fn());

    subject.next(USER);
    subject.complete();

    expect(mockToastr.success).toHaveBeenCalledWith('Perfil atualizado com sucesso.');
    expect(service.updateLoading()).toBe(false);
  });

  it('update() com erro: exibe toastr de erro, não chama onSuccess, reset loading', () => {
    const subject = new Subject<User>();
    mockUserService.updateUser.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.update(7, { username: 'x', email: 'x@e.com', password: 'p' }, onSuccess);

    subject.error(new Error('Server Error'));

    expect(mockToastr.error).toHaveBeenCalledWith('Erro ao atualizar perfil. Tente novamente.');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(service.updateLoading()).toBe(false);
  });

  // ── delete() ──────────────────────────────────────────────────────────────

  it('delete() define deleteLoading=true enquanto pendente', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    service.delete(7);
    expect(service.deleteLoading()).toBe(true);
  });

  it('delete() com sucesso: exibe toastr, remove token e navega para /login', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    service.delete(7);

    subject.next(USER);
    subject.complete();

    expect(mockToastr.success).toHaveBeenCalledWith('Conta excluída com sucesso.');
    expect(mockTokenService.removeToken).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('delete() com sucesso: chama o callback onSuccess quando fornecido', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.delete(7, onSuccess);

    subject.next(USER);
    subject.complete();

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('delete() com sucesso: não lança erro quando onSuccess não é fornecido', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    service.delete(7); // sem callback

    expect(() => {
      subject.next(USER);
      subject.complete();
    }).not.toThrow();
  });

  it('delete() com sucesso: deleteLoading=false após finalizar', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    service.delete(7);

    subject.next(USER);
    subject.complete();

    expect(service.deleteLoading()).toBe(false);
  });

  it('delete() com erro: exibe toastr de erro, não remove token, não navega', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    service.delete(7);

    subject.error(new Error('Not Found'));

    expect(mockToastr.error).toHaveBeenCalledWith('Erro ao excluir conta. Tente novamente.');
    expect(mockTokenService.removeToken).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(service.deleteLoading()).toBe(false);
  });

  it('delete() chama userService.deleteUser com o id correto', () => {
    const subject = new Subject<User>();
    mockUserService.deleteUser.mockReturnValue(subject.asObservable());
    service.delete(42);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(42);
  });
});
