import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { CartsIntegrationService } from './carts-integration.service';
import { CartsService } from '@shared/services/carts.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import type { Cart, CartPayload } from '@shared/interfaces/cart.interface';

const CART: Cart = {
  id: 1,
  userId: 7,
  date: '2025-01-15',
  products: [{ productId: 3, quantity: 2 }],
};

const PAYLOAD: CartPayload = {
  userId: 7,
  date: '2025-01-15',
  products: [{ productId: 3, quantity: 2 }],
};

describe('CartsIntegrationService', () => {
  let service: CartsIntegrationService;
  let mockCartsService: { addCart: jest.Mock; updateCart: jest.Mock; deleteCart: jest.Mock };
  let mockToastr: { success: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    mockCartsService = {
      addCart: jest.fn(),
      updateCart: jest.fn(),
      deleteCart: jest.fn(),
    };
    mockToastr = { success: jest.fn(), error: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        CartsIntegrationService,
        { provide: CartsService, useValue: mockCartsService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    });

    service = TestBed.inject(CartsIntegrationService);
  });

  // ── add() ────────────────────────────────────────────────────────────────

  describe('add()', () => {
    it('define addLoading=true enquanto pendente', () => {
      mockCartsService.addCart.mockReturnValue(new Subject<Cart>().asObservable());
      service.add(PAYLOAD, jest.fn());
      expect(service.addLoading()).toBe(true);
    });

    it('com sucesso: chama onSuccess com o carrinho criado', () => {
      const subject = new Subject<Cart>();
      mockCartsService.addCart.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.add(PAYLOAD, onSuccess);
      subject.next(CART);
      subject.complete();

      expect(onSuccess).toHaveBeenCalledWith(CART);
    });

    it('com sucesso: exibe toastr correto e reseta loading', () => {
      const subject = new Subject<Cart>();
      mockCartsService.addCart.mockReturnValue(subject.asObservable());

      service.add(PAYLOAD, jest.fn());
      subject.next(CART);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Carrinho adicionado com sucesso.');
      expect(service.addLoading()).toBe(false);
    });

    it('chama cartsService.addCart com o payload correto', () => {
      mockCartsService.addCart.mockReturnValue(new Subject<Cart>().asObservable());
      service.add(PAYLOAD, jest.fn());
      expect(mockCartsService.addCart).toHaveBeenCalledWith(PAYLOAD);
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<Cart>();
      mockCartsService.addCart.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.add(PAYLOAD, onSuccess);
      subject.error(new Error('Bad Request'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao adicionar carrinho. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.addLoading()).toBe(false);
    });
  });

  // ── update() ─────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('define updateLoading=true enquanto pendente', () => {
      mockCartsService.updateCart.mockReturnValue(new Subject<Cart>().asObservable());
      service.update(CART.id, PAYLOAD, jest.fn());
      expect(service.updateLoading()).toBe(true);
    });

    it('com sucesso: chama onSuccess com o carrinho atualizado', () => {
      const subject = new Subject<Cart>();
      const updated = { ...CART, date: '2025-02-01' };
      mockCartsService.updateCart.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.update(CART.id, PAYLOAD, onSuccess);
      subject.next(updated);
      subject.complete();

      expect(onSuccess).toHaveBeenCalledWith(updated);
    });

    it('com sucesso: exibe toastr correto e reseta loading', () => {
      const subject = new Subject<Cart>();
      mockCartsService.updateCart.mockReturnValue(subject.asObservable());

      service.update(CART.id, PAYLOAD, jest.fn());
      subject.next(CART);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Carrinho atualizado com sucesso.');
      expect(service.updateLoading()).toBe(false);
    });

    it('chama cartsService.updateCart com id e payload corretos', () => {
      mockCartsService.updateCart.mockReturnValue(new Subject<Cart>().asObservable());
      service.update(CART.id, PAYLOAD, jest.fn());
      expect(mockCartsService.updateCart).toHaveBeenCalledWith(CART.id, PAYLOAD);
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<Cart>();
      mockCartsService.updateCart.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.update(CART.id, PAYLOAD, onSuccess);
      subject.error(new Error('Server Error'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao atualizar carrinho. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.updateLoading()).toBe(false);
    });
  });

  // ── delete() ─────────────────────────────────────────────────────────────

  describe('delete()', () => {
    it('define deleteLoading=true enquanto pendente', () => {
      mockCartsService.deleteCart.mockReturnValue(new Subject<Cart>().asObservable());
      service.delete(CART.id, jest.fn());
      expect(service.deleteLoading()).toBe(true);
    });

    it('com sucesso: exibe toastr correto e chama onSuccess', () => {
      const subject = new Subject<Cart>();
      mockCartsService.deleteCart.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.delete(CART.id, onSuccess);
      subject.next(CART);
      subject.complete();

      expect(mockToastr.success).toHaveBeenCalledWith('Carrinho excluído com sucesso.');
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('com sucesso: reseta deleteLoading', () => {
      const subject = new Subject<Cart>();
      mockCartsService.deleteCart.mockReturnValue(subject.asObservable());

      service.delete(CART.id, jest.fn());
      subject.next(CART);
      subject.complete();

      expect(service.deleteLoading()).toBe(false);
    });

    it('chama cartsService.deleteCart com o id correto', () => {
      mockCartsService.deleteCart.mockReturnValue(new Subject<Cart>().asObservable());
      service.delete(42, jest.fn());
      expect(mockCartsService.deleteCart).toHaveBeenCalledWith(42);
    });

    it('com erro: exibe toastr de erro, não chama onSuccess e reseta loading', () => {
      const subject = new Subject<Cart>();
      mockCartsService.deleteCart.mockReturnValue(subject.asObservable());
      const onSuccess = jest.fn();

      service.delete(CART.id, onSuccess);
      subject.error(new Error('Not Found'));

      expect(mockToastr.error).toHaveBeenCalledWith('Erro ao excluir carrinho. Tente novamente.');
      expect(onSuccess).not.toHaveBeenCalled();
      expect(service.deleteLoading()).toBe(false);
    });
  });
});
