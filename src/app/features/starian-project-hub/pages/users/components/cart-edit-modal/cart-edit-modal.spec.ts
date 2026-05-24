import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CartEditModalComponent } from './cart-edit-modal';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import { CartFormService, type SelectedItem } from '../../../../services/cart-form/cart-form.service';
import type { Product } from '@shared/interfaces/products.interface';
import type { Cart, CartProductPayload } from '@shared/interfaces/cart.interface';

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

const CART: Cart = {
  id: 7,
  userId: 3,
  date: '2025-04-10',
  products: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 },
  ],
};

describe('CartEditModalComponent', () => {
  let fixture: ComponentFixture<CartEditModalComponent>;
  let comp: CartEditModalComponent;

  let mockClose: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockIsValid: ReturnType<typeof signal<boolean>>;
  let mockBuildProductsPayload: jest.Mock;
  let mockAllProducts: ReturnType<typeof signal<Product[]>>;
  let mockSelectedItems: ReturnType<typeof signal<SelectedItem[]>>;

  beforeEach(async () => {
    mockClose = jest.fn();
    mockUpdate = jest.fn();
    mockIsValid = signal(false);
    mockBuildProductsPayload = jest.fn().mockReturnValue([]);
    mockAllProducts = signal<Product[]>([]);
    mockSelectedItems = signal<SelectedItem[]>([]);

    const mockCartForm = {
      searchQuery: signal(''),
      selectedItems: mockSelectedItems,
      allProducts: mockAllProducts,
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
      imports: [CartEditModalComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: mockClose } },
        { provide: DynamicDialogConfig, useValue: { data: CART } },
        {
          provide: CartsIntegrationService,
          useValue: { updateLoading: signal(false), update: mockUpdate },
        },
      ],
    })
      .overrideComponent(CartEditModalComponent, {
        remove: { providers: [CartFormService] },
        add: { providers: [{ provide: CartFormService, useValue: mockCartForm }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CartEditModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Renderização ──────────────────────────────────────────────────────────

  it('renderiza o título "Editar carrinho"', () => {
    const title = fixture.nativeElement.querySelector('#cart-edit-dialog-title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Editar carrinho');
  });

  it('renderiza o id do carrinho no subtítulo', () => {
    const subtitle = fixture.nativeElement.querySelector('.cart-form__subtitle') as HTMLElement;
    expect(subtitle.textContent).toContain('#7');
  });

  it('renderiza os botões de ação (cancelar e salvar)', () => {
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

  it('submit() não chama update() quando isValid=false', () => {
    mockIsValid.set(false);
    (comp as any).submit();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  // ── submit() — formulário válido ──────────────────────────────────────────

  it('submit() chama integrationService.update() quando isValid=true', () => {
    mockIsValid.set(true);
    (comp as any).submit();
    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });

  it('submit() passa o cartId correto para update()', () => {
    mockIsValid.set(true);
    (comp as any).submit();
    expect(mockUpdate).toHaveBeenCalledWith(
      CART.id,
      expect.anything(),
      expect.any(Function),
    );
  });

  it('submit() passa o userId do carrinho no payload', () => {
    mockIsValid.set(true);
    (comp as any).submit();
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ userId: CART.userId }),
      expect.any(Function),
    );
  });

  it('submit() passa os produtos de buildProductsPayload no payload', () => {
    const payload = [makePayload(1), makePayload(2)];
    mockIsValid.set(true);
    mockBuildProductsPayload.mockReturnValue(payload);
    (comp as any).submit();
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ products: payload }),
      expect.any(Function),
    );
  });

  it('callback onSuccess de update() fecha o dialog com o carrinho atualizado', () => {
    const updatedCart = { ...CART, date: '2025-05-01' };
    mockIsValid.set(true);
    mockUpdate.mockImplementation(
      (_id: number, _p: unknown, onSuccess: (c: typeof updatedCart) => void) =>
        onSuccess(updatedCart),
    );
    (comp as any).submit();
    expect(mockClose).toHaveBeenCalledWith(updatedCart);
  });

  // ── syncSelectedItemsFromCart() ───────────────────────────────────────────

  it('pré-preenche selectedItems quando os produtos do catálogo carregam', () => {
    const p1 = makeProduct(1);
    const p2 = makeProduct(2);

    // Simula o carregamento dos produtos (allProducts inicialmente vazio)
    mockAllProducts.set([p1, p2]);
    fixture.detectChanges();

    const items = mockSelectedItems();
    expect(items).toHaveLength(2);
    expect(items.find((i) => i.product.id === 1)?.quantity).toBe(2); // quantidade do carrinho
    expect(items.find((i) => i.product.id === 2)?.quantity).toBe(1);
  });

  it('ignora produtos do catálogo que não estão no carrinho', () => {
    const p1 = makeProduct(1);
    const pExtra = makeProduct(99); // não está no carrinho

    mockAllProducts.set([p1, pExtra]);
    fixture.detectChanges();

    const items = mockSelectedItems();
    expect(items.some((i) => i.product.id === 99)).toBe(false);
  });

  it('não re-preenche selectedItems após o primeiro carregamento (initDone)', () => {
    const p1 = makeProduct(1);
    mockAllProducts.set([p1]);
    fixture.detectChanges();

    const firstItems = [...mockSelectedItems()];

    // Simula segunda mudança nos produtos
    mockAllProducts.set([p1, makeProduct(2)]);
    fixture.detectChanges();

    // selectedItems não deve ter sido alterado novamente
    expect(mockSelectedItems()).toEqual(firstItems);
  });

  // ── buildQuantityMap (via comportamento observável) ───────────────────────

  it('soma quantidades de productIds duplicados no carrinho', () => {
    const duplicatedProducts = [
      { productId: 1, quantity: 3 },
      { productId: 1, quantity: 2 }, // mesmo id, soma = 5
    ];
    const result = (comp as any).buildQuantityMap(duplicatedProducts) as Map<number, number>;
    expect(result.get(1)).toBe(5);
  });
});
