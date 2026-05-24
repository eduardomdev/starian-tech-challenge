import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { UserIntegrationService } from './user-integration.service';
import { UserService } from '@shared/services/user.service';
import { TokenService } from '@core/tokens/token.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import type { User } from '@shared/interfaces/user.interface';

jest.mock('@shared/utils/storage-id', () => ({ nextUserId: jest.fn().mockReturnValue(99) }));

const USER: User = {
  id: 7,
  username: 'jsilva',
  email: 'j@silva.com',
  password: 'secret',
  name: { firstname: 'João', lastname: 'Silva' },
};

const PAYLOAD = { username: 'novo', email: 'novo@e.com', password: '123' };

describe('UserIntegrationService', () => {
  let service: UserIntegrationService;
  let mockUserService: { updateUser: jest.Mock; deleteUser: jest.Mock; addUser: jest.Mock };
  let mockTokenService: { removeToken: jest.Mock };
  let mockToastr: { success: jest.Mock; error: jest.Mock };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    mockUserService = {
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      addUser: jest.fn(),
    };
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

  // ── updateProfile() ──────────────────────────────────────────────────────

  describe('updateProfile()', () => {
    it('define updateProfileLoading=true enquanto pendente', () => {
      mockUserService.updateUser.mockReturnValue(new Subject<User>().asObservable());
      service.updateProfile(USER.id, PAYLOAD, jest.fn());
      expect(service.updateProfileLoading()).toBe(true);
    });

    it('com sucesso: chama onSuccess com o usuário atualizado', () => {
      const subject = new Subject<User>();
      const updated = { ...USER, username: 'novo' };
      mockUserService.updateUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.updateProfile(USER.id, PAYLOAD, onSuccess);
      subject.next(updated);
      subject.complete();

      expect(onSuccess).toHaveBeenCalledWith(updated);
    });

    it('com sucesso: exibe toastr correto e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.updateUser.mockReturnValue(subject.asObservable());

      service.updateProfile(USER.id, PAYLOAD, jest.fn());
      subject.next(USER);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Perfil atualizado com sucesso.');
      expect(service.updateProfileLoading()).toBe(false);
    });

    it('com sucesso: chama userService.updateUser com os argumentos corretos', () => {
      mockUserService.updateUser.mockReturnValue(new Subject<User>().asObservable());
      service.updateProfile(USER.id, PAYLOAD, jest.fn());
      expect(mockUserService.updateUser).toHaveBeenCalledWith(USER.id, PAYLOAD);
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.updateUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.updateProfile(USER.id, PAYLOAD, onSuccess);
      subject.error(new Error('Server Error'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao atualizar perfil. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.updateProfileLoading()).toBe(false);
    });
  });

  // ── deleteAccount() ──────────────────────────────────────────────────────

  describe('deleteAccount()', () => {
    it('define deleteAccountLoading=true enquanto pendente', () => {
      mockUserService.deleteUser.mockReturnValue(new Subject<User>().asObservable());
      service.deleteAccount(USER.id);
      expect(service.deleteAccountLoading()).toBe(true);
    });

    it('com sucesso: exibe toastr, remove token e navega para /login', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());

      service.deleteAccount(USER.id);
      subject.next(USER);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Conta excluída com sucesso.');
      expect(mockTokenService.removeToken).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('com sucesso: chama onSuccess quando fornecido', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.deleteAccount(USER.id, onSuccess);
      subject.next(USER);
      subject.complete();

      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('com sucesso: não lança erro quando onSuccess é omitido', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());

      service.deleteAccount(USER.id);

      expect(() => {
        subject.next(USER);
        subject.complete();
      }).not.toThrow();
    });

    it('com sucesso: reseta deleteAccountLoading', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());

      service.deleteAccount(USER.id);
      subject.next(USER);
      subject.complete();

      expect(service.deleteAccountLoading()).toBe(false);
    });

    it('com erro: exibe toastr de erro, não remove token, não navega e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());

      service.deleteAccount(USER.id);
      subject.error(new Error('Not Found'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao excluir conta. Tente novamente.');
      expect(mockTokenService.removeToken).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(service.deleteAccountLoading()).toBe(false);
    });

    it('chama userService.deleteUser com o id correto', () => {
      mockUserService.deleteUser.mockReturnValue(new Subject<User>().asObservable());
      service.deleteAccount(42);
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(42);
    });
  });

  // ── add() ────────────────────────────────────────────────────────────────

  describe('add()', () => {
    const ADD_PAYLOAD = { username: 'novo', email: 'novo@e.com', password: 'pass' };

    it('define addLoading=true enquanto pendente', () => {
      mockUserService.addUser.mockReturnValue(new Subject<User>().asObservable());
      service.add(ADD_PAYLOAD, jest.fn());
      expect(service.addLoading()).toBe(true);
    });

    it('com sucesso: chama onSuccess com o usuário criado', () => {
      const subject = new Subject<User>();
      mockUserService.addUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.add(ADD_PAYLOAD, onSuccess);
      subject.next(USER);
      subject.complete();

      expect(onSuccess).toHaveBeenCalledWith(USER);
    });

    it('com sucesso: exibe toastr correto e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.addUser.mockReturnValue(subject.asObservable());

      service.add(ADD_PAYLOAD, jest.fn());
      subject.next(USER);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Usuário adicionado com sucesso.');
      expect(service.addLoading()).toBe(false);
    });

    it('chama userService.addUser incluindo o id gerado por nextUserId', () => {
      mockUserService.addUser.mockReturnValue(new Subject<User>().asObservable());
      service.add(ADD_PAYLOAD, jest.fn());
      expect(mockUserService.addUser).toHaveBeenCalledWith({ ...ADD_PAYLOAD, id: 99 });
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.addUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.add(ADD_PAYLOAD, onSuccess);
      subject.error(new Error('Bad Request'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao adicionar usuário. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.addLoading()).toBe(false);
    });
  });

  // ── update() (admin) ─────────────────────────────────────────────────────

  describe('update()', () => {
    it('define updateLoading=true enquanto pendente', () => {
      mockUserService.updateUser.mockReturnValue(new Subject<User>().asObservable());
      service.update(USER.id, PAYLOAD, jest.fn());
      expect(service.updateLoading()).toBe(true);
    });

    it('com sucesso: chama onSuccess com o usuário atualizado', () => {
      const subject = new Subject<User>();
      const updated = { ...USER, username: 'novo' };
      mockUserService.updateUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.update(USER.id, PAYLOAD, onSuccess);
      subject.next(updated);
      subject.complete();

      expect(onSuccess).toHaveBeenCalledWith(updated);
    });

    it('com sucesso: exibe toastr correto e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.updateUser.mockReturnValue(subject.asObservable());

      service.update(USER.id, PAYLOAD, jest.fn());
      subject.next(USER);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Usuário atualizado com sucesso.');
      expect(service.updateLoading()).toBe(false);
    });

    it('chama userService.updateUser com os argumentos corretos', () => {
      mockUserService.updateUser.mockReturnValue(new Subject<User>().asObservable());
      service.update(USER.id, PAYLOAD, jest.fn());
      expect(mockUserService.updateUser).toHaveBeenCalledWith(USER.id, PAYLOAD);
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.updateUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.update(USER.id, PAYLOAD, onSuccess);
      subject.error(new Error('Server Error'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao atualizar usuário. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.updateLoading()).toBe(false);
    });
  });

  // ── delete() (admin) ─────────────────────────────────────────────────────

  describe('delete()', () => {
    it('define deleteLoading=true enquanto pendente', () => {
      mockUserService.deleteUser.mockReturnValue(new Subject<User>().asObservable());
      service.delete(USER.id, jest.fn());
      expect(service.deleteLoading()).toBe(true);
    });

    it('com sucesso: exibe toastr correto e chama onSuccess', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.delete(USER.id, onSuccess);
      subject.next(USER);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Usuário excluído com sucesso.');
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('com sucesso: não remove token nem navega', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());

      service.delete(USER.id, jest.fn());
      subject.next(USER);
      subject.complete();

      expect(mockTokenService.removeToken).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('com sucesso: reseta deleteLoading', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());

      service.delete(USER.id, jest.fn());
      subject.next(USER);
      subject.complete();

      expect(service.deleteLoading()).toBe(false);
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<User>();
      mockUserService.deleteUser.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.delete(USER.id, onSuccess);
      subject.error(new Error('Not Found'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao excluir usuário. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.deleteLoading()).toBe(false);
    });

    it('chama userService.deleteUser com o id correto', () => {
      mockUserService.deleteUser.mockReturnValue(new Subject<User>().asObservable());
      service.delete(42, jest.fn());
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(42);
    });
  });
});
