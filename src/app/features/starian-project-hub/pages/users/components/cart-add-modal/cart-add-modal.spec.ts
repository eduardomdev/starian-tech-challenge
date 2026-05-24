import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CartAddModalComponent } from './cart-add-modal';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import { CartFormService, type SelectedItem } from '../../../../services/cart-form/cart-form.service';
import type { Product } from '@shared/interfaces/products.interface';
import type { CartProductPayload } from '@shared/interfaces/cart.interface';

function makeProduct(id: number): Product {
  return {
    id,
    title: `Produto ${id}`,
    price: 10 * id,
    category: 'electronics',
    description: '',
    image: `img/${id}.jpg`,
    rating: { rate: 4, count: 100 },
  };
}

function makePayload(id: number): CartProductPayload {
  return { id, title: `Produto ${id}`, price: 10 * id, description: '', category: 'electronics', image: `img/${id}.jpg` };
}

describe('CartAddModalComponent', () => {
  let fixture: ComponentFixture<CartAddModalComponent>;
  let comp: CartAddModalComponent;

  let mockClose: jest.Mock;
  let mockAdd: jest.Mock;
  let mockIsValid: ReturnType<typeof signal<boolean>>;
  let mockBuildProductsPayload: jest.Mock;
  let mockSelectedItems: ReturnType<typeof signal<SelectedItem[]>>;

  beforeEach(async () => {
    mockClose = jest.fn();
    mockAdd = jest.fn();
    mockIsValid = signal(false);
    mockBuildProductsPayload = jest.fn().mockReturnValue([]);
    mockSelectedItems = signal<SelectedItem[]>([]);

    const mockCartForm = {
      searchQuery: signal(''),
      selectedItems: mockSelectedItems,
      allProducts: signal<Product[]>([]),
      productsLoading: signal(false),
      productsError: signal(false),
      filteredProducts: signal<Product[]>([]),
      isValid: mockIsValid,
      selectedIds: signal(new Set<number>()),
      addProduct: jest.fn(),
      removeProduct: jest.fn(),
      increaseQuantity: jest.fn(),
      decreaseQuantity: jest.fn(),
      buildProductsPayload: mockBuildProductsPayload,
    };

    await TestBed.configureTestingModule({
      imports: [CartAddModalComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: mockClose } },
        { provide: DynamicDialogConfig, useValue: { data: { userId: 5 } } },
        {
          provide: CartsIntegrationService,
          useValue: { addLoading: signal(false), add: mockAdd },
        },
      ],
    })
      .overrideComponent(CartAddModalComponent, {
        remove: { providers: [CartFormService] },
        add: { providers: [{ provide: CartFormService, useValue: mockCartForm }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartAddModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Renderização ──────────────────────────────────────────────────────────

  it('renderiza o título "Adicionar carrinho"', () => {
    const title = fixture.nativeElement.querySelector('#cart-add-dialog-title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Adicionar carrinho');
  });

  it('renderiza o subtítulo com instrução', () => {
    const subtitle = fixture.nativeElement.querySelector('.cart-form__subtitle') as HTMLElement;
    expect(subtitle.textContent).toContain('Selecione os produtos');
  });

  it('renderiza os botões de ação (cancelar e adicionar)', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.cart-form__actions str-button');
    expect(buttons.length).toBe(2);
  });

  // ── cancel() ─────────────────────────────────────────────────────────────

  it('cancel() fecha o dialog sem argumento', () => {
    (comp as any).cancel();
    expect(mockClose).toHaveBeenCalledTimes(1);
    expect(mockClose).toHaveBeenCalledWith();
  });

  // ── submit() — formulário inválido ────────────────────────────────────────

  it('submit() não chama add() quando isValid=false', () => {
    mockIsValid.set(false);
    (comp as any).submit();
    expect(mockAdd).not.toHaveBeenCalled();
  });

  // ── submit() — formulário válido ──────────────────────────────────────────

  it('submit() chama integrationService.add() quando isValid=true', () => {
    mockIsValid.set(true);
    (comp as any).submit();
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it('submit() passa o userId correto (vindo da config) para add()', () => {
    mockIsValid.set(true);
    (comp as any).submit();
    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 5 }),
      expect.any(Function),
    );
  });

  it('submit() passa os produtos do buildProductsPayload para add()', () => {
    const payload = [makePayload(3)];
    mockIsValid.set(true);
    mockBuildProductsPayload.mockReturnValue(payload);
    (comp as any).submit();
    expect(mockAdd).toHaveBeenCalledWith(
      expect.objectContaining({ products: payload }),
      expect.any(Function),
    );
  });

  it('callback onSuccess de add() fecha o dialog com o carrinho criado', () => {
    const createdCart = { id: 99, userId: 5, date: '2025-01-01', products: [] };
    mockIsValid.set(true);
    mockAdd.mockImplementation(
      (_p: unknown, onSuccess: (c: typeof createdCart) => void) => onSuccess(createdCart),
    );
    (comp as any).submit();
    expect(mockClose).toHaveBeenCalledWith(createdCart);
  });
});
