import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { ProductsIntegrationService } from './products-integration.service';
import { ProductsService } from '@shared/services/products.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';
import type { Product } from '@shared/interfaces/products.interface';

const PRODUCT: Product = {
  id: 1,
  title: 'Produto Teste',
  price: 99.90,
  category: 'electronics',
  description: 'Descrição',
  image: 'https://img.url/p.jpg',
  rating: { rate: 4.5, count: 100 },
};

describe('ProductsIntegrationService', () => {
  let service: ProductsIntegrationService;
  let mockProductsService: {
    addProduct: jest.Mock;
    updateProduct: jest.Mock;
    deleteProduct: jest.Mock;
  };
  let mockToastr: { success: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    mockProductsService = {
      addProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    };
    mockToastr = { success: jest.fn(), error: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        ProductsIntegrationService,
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    });

    service = TestBed.inject(ProductsIntegrationService);
  });

  // ── add() ─────────────────────────────────────────────────────────────────

  it('add() define addLoading=true enquanto pendente', () => {
    const subject = new Subject<Product>();
    mockProductsService.addProduct.mockReturnValue(subject.asObservable());
    service.add(PRODUCT, jest.fn());
    expect(service.addLoading()).toBe(true);
  });

  it('add() com sucesso: chama onSuccess com o produto criado', () => {
    const subject = new Subject<Product>();
    mockProductsService.addProduct.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.add(PRODUCT, onSuccess);

    subject.next(PRODUCT);
    subject.complete();

    expect(onSuccess).toHaveBeenCalledWith(PRODUCT);
  });

  it('add() com sucesso: exibe toastr de sucesso', () => {
    const subject = new Subject<Product>();
    mockProductsService.addProduct.mockReturnValue(subject.asObservable());
    service.add(PRODUCT, jest.fn());

    subject.next(PRODUCT);
    subject.complete();

    expect(mockToastr.success).toHaveBeenCalledWith('Produto adicionado com sucesso.');
  });

  it('add() com sucesso: addLoading=false após finalizar', () => {
    const subject = new Subject<Product>();
    mockProductsService.addProduct.mockReturnValue(subject.asObservable());
    service.add(PRODUCT, jest.fn());

    subject.next(PRODUCT);
    subject.complete();

    expect(service.addLoading()).toBe(false);
  });

  it('add() com erro: exibe toastr de erro e não chama onSuccess', () => {
    const subject = new Subject<Product>();
    mockProductsService.addProduct.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.add(PRODUCT, onSuccess);

    subject.error(new Error('Server Error'));

    expect(mockToastr.error).toHaveBeenCalledWith('Erro ao adicionar produto. Tente novamente.');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(service.addLoading()).toBe(false);
  });

  // ── update() ──────────────────────────────────────────────────────────────

  it('update() define updateLoading=true enquanto pendente', () => {
    const subject = new Subject<Product>();
    mockProductsService.updateProduct.mockReturnValue(subject.asObservable());
    service.update(PRODUCT, jest.fn());
    expect(service.updateLoading()).toBe(true);
  });

  it('update() com sucesso: chama onSuccess com o produto atualizado', () => {
    const subject = new Subject<Product>();
    const updated = { ...PRODUCT, title: 'Novo título' };
    mockProductsService.updateProduct.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.update(PRODUCT, onSuccess);

    subject.next(updated);
    subject.complete();

    expect(onSuccess).toHaveBeenCalledWith(updated);
    expect(mockToastr.success).toHaveBeenCalledWith('Produto atualizado com sucesso.');
  });

  it('update() com sucesso: updateLoading=false após finalizar', () => {
    const subject = new Subject<Product>();
    mockProductsService.updateProduct.mockReturnValue(subject.asObservable());
    service.update(PRODUCT, jest.fn());

    subject.next(PRODUCT);
    subject.complete();

    expect(service.updateLoading()).toBe(false);
  });

  it('update() com erro: exibe toastr de erro e não chama onSuccess', () => {
    const subject = new Subject<Product>();
    mockProductsService.updateProduct.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.update(PRODUCT, onSuccess);

    subject.error(new Error('Not Found'));

    expect(mockToastr.error).toHaveBeenCalledWith('Erro ao atualizar produto. Tente novamente.');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(service.updateLoading()).toBe(false);
  });

  // ── delete() ──────────────────────────────────────────────────────────────

  it('delete() define deleteLoading=true enquanto pendente', () => {
    const subject = new Subject<void>();
    mockProductsService.deleteProduct.mockReturnValue(subject.asObservable());
    service.delete(1, jest.fn());
    expect(service.deleteLoading()).toBe(true);
  });

  it('delete() com sucesso: chama onSuccess e exibe toastr de sucesso', () => {
    const subject = new Subject<void>();
    mockProductsService.deleteProduct.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.delete(1, onSuccess);

    subject.next();
    subject.complete();

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(mockToastr.success).toHaveBeenCalledWith('Produto excluído com sucesso.');
    expect(service.deleteLoading()).toBe(false);
  });

  it('delete() com erro: exibe toastr de erro e não chama onSuccess', () => {
    const subject = new Subject<void>();
    mockProductsService.deleteProduct.mockReturnValue(subject.asObservable());
    const onSuccess = jest.fn();
    service.delete(1, onSuccess);

    subject.error(new Error('Not Found'));

    expect(mockToastr.error).toHaveBeenCalledWith('Erro ao excluir produto. Tente novamente.');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(service.deleteLoading()).toBe(false);
  });

  it('delete() chama productsService.deleteProduct com o id correto', () => {
    const subject = new Subject<void>();
    mockProductsService.deleteProduct.mockReturnValue(subject.asObservable());
    service.delete(42, jest.fn());
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(42);
  });
});
