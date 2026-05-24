import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { UserCartsModalComponent } from './user-carts-modal';
import { CartsService } from '@shared/services/carts.service';
import { CartsIntegrationService } from '../../../../services/carts-integration/carts-integration.service';
import type { User } from '@shared/interfaces/user.interface';
import type { Cart } from '@shared/interfaces/cart.interface';

const USER: User = {
  id: 3,
  username: 'jsilva',
  email: 'j@silva.com',
  password: 'secret',
  name: { firstname: 'João', lastname: 'Silva' },
};

function makeCart(id: number, products: Cart['products'] = []): Cart {
  return { id, userId: USER.id, date: '2025-03-10', products };
}

// Helper: seleciona apenas células de corpo de tabela, não cabeçalhos
function bodyCell(el: HTMLElement, cls: string): HTMLElement {
  return el.querySelector(`tbody td.${cls}`) as HTMLElement;
}

describe('UserCartsModalComponent', () => {
  let fixture: ComponentFixture<UserCartsModalComponent>;
  let comp: UserCartsModalComponent;

  let cartsValue: ReturnType<typeof signal<Cart[] | undefined>>;
  let loadingValue: ReturnType<typeof signal<boolean>>;
  let errorValue: ReturnType<typeof signal<unknown>>;
  let mockLoadUserCarts: jest.Mock;
  let mockReload: jest.Mock;
  let mockDialogOpen: jest.Mock;
  let mockClose: jest.Mock;

  beforeEach(async () => {
    cartsValue = signal<Cart[] | undefined>(undefined);
    loadingValue = signal(false);
    errorValue = signal<unknown>(undefined);
    mockLoadUserCarts = jest.fn();
    mockReload = jest.fn();
    mockDialogOpen = jest
      .fn()
      .mockReturnValue({ onClose: { subscribe: jest.fn() } });
    mockClose = jest.fn();

    const mockDialogService = { open: mockDialogOpen };

    await TestBed.configureTestingModule({
      imports: [UserCartsModalComponent],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: USER } },
        { provide: DynamicDialogRef, useValue: { close: mockClose } },
        {
          provide: CartsService,
          useValue: {
            userCarts: {
              value: cartsValue,
              isLoading: loadingValue,
              error: errorValue,
              reload: mockReload,
            },
            loadUserCarts: mockLoadUserCarts,
          },
        },
        {
          provide: CartsIntegrationService,
          useValue: { deleteLoading: signal(false) },
        },
      ],
    })
      .overrideComponent(UserCartsModalComponent, {
        remove: { providers: [DialogService] },
        add: { providers: [{ provide: DialogService, useValue: mockDialogService }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserCartsModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Inicialização ─────────────────────────────────────────────────────────

  it('chama loadUserCarts com o id do usuário ao inicializar', () => {
    expect(mockLoadUserCarts).toHaveBeenCalledWith(USER.id);
  });

  it('chama userCarts.reload() ao inicializar', () => {
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('exibe o nome completo do usuário no título', () => {
    const title = fixture.nativeElement.querySelector('#carts-dialog-title') as HTMLElement;
    expect(title.textContent).toContain('João Silva');
  });

  it('exibe o id do usuário no subtítulo', () => {
    const subtitle = fixture.nativeElement.querySelector('.subtitle-font-14') as HTMLElement;
    expect(subtitle.textContent).toContain('#3');
  });

  // ── Estado de loading ─────────────────────────────────────────────────────

  it('exibe skeleton quando loading=true', () => {
    loadingValue.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-user-carts-skeleton')).not.toBeNull();
  });

  it('não exibe a tabela quando loading=true', () => {
    loadingValue.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.carts-table')).toBeNull();
  });

  it('não exibe skeleton quando loading=false e há dados', () => {
    loadingValue.set(false);
    cartsValue.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-user-carts-skeleton')).toBeNull();
  });

  // ── Estado de erro ────────────────────────────────────────────────────────

  it('exibe mensagem de erro quando error está definido', () => {
    errorValue.set(new Error('Network error'));
    fixture.detectChanges();
    const errorEl = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('Erro ao carregar os carrinhos.');
  });

  it('não exibe a tabela quando há erro', () => {
    errorValue.set(new Error('fail'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.carts-table')).toBeNull();
  });

  // ── Estado vazio ──────────────────────────────────────────────────────────

  it('exibe mensagem de vazio quando carts é uma lista vazia', () => {
    cartsValue.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nenhum carrinho encontrado');
  });

  it('não exibe a tabela quando carts está vazio', () => {
    cartsValue.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.carts-table')).toBeNull();
  });

  // ── Tabela de carrinhos ───────────────────────────────────────────────────

  it('exibe a tabela quando há carrinhos', () => {
    cartsValue.set([makeCart(1)]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.carts-table')).not.toBeNull();
  });

  it('renderiza uma linha por carrinho', () => {
    cartsValue.set([makeCart(1), makeCart(2), makeCart(3)]);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.carts-table tbody tr');
    expect(rows).toHaveLength(3);
  });

  it('exibe o id do carrinho com prefixo "#"', () => {
    cartsValue.set([makeCart(42)]);
    fixture.detectChanges();
    const idCell = bodyCell(fixture.nativeElement, 'col-cart-id');
    expect(idCell.textContent?.trim()).toBe('#42');
  });

  it('exibe a data do carrinho formatada (dd/MM/yyyy)', () => {
    cartsValue.set([makeCart(1)]);
    fixture.detectChanges();
    const dateCell = bodyCell(fixture.nativeElement, 'col-cart-date');
    expect(dateCell.textContent?.trim()).toBe('10/03/2025');
  });

  it('exibe a quantidade de itens únicos (products.length)', () => {
    const cart = makeCart(1, [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ]);
    cartsValue.set([cart]);
    fixture.detectChanges();
    const productsCell = bodyCell(fixture.nativeElement, 'col-cart-products');
    expect(productsCell.textContent).toContain('2 produtos');
  });

  it('exibe "1 produto" no singular', () => {
    const cart = makeCart(1, [{ productId: 1, quantity: 3 }]);
    cartsValue.set([cart]);
    fixture.detectChanges();
    const productsCell = bodyCell(fixture.nativeElement, 'col-cart-products');
    expect(productsCell.textContent).toContain('1 produto');
    expect(productsCell.textContent).not.toContain('1 produtos');
  });

  // ── Cálculo de totalItems() ───────────────────────────────────────────────

  it('calcula o total de itens somando as quantidades', () => {
    const cart = makeCart(1, [
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 2 },
      { productId: 3, quantity: 1 },
    ]);
    cartsValue.set([cart]);
    fixture.detectChanges();
    const itemsCell = bodyCell(fixture.nativeElement, 'col-cart-items');
    expect(itemsCell.textContent).toContain('6 itens');
  });

  it('exibe "1 item" no singular', () => {
    const cart = makeCart(1, [{ productId: 1, quantity: 1 }]);
    cartsValue.set([cart]);
    fixture.detectChanges();
    const itemsCell = bodyCell(fixture.nativeElement, 'col-cart-items');
    expect(itemsCell.textContent).toContain('1 item');
    expect(itemsCell.textContent).not.toContain('1 itens');
  });

  it('exibe "0 itens" quando o carrinho não tem produtos', () => {
    const cart = makeCart(1, []);
    cartsValue.set([cart]);
    fixture.detectChanges();
    const itemsCell = bodyCell(fixture.nativeElement, 'col-cart-items');
    expect(itemsCell.textContent).toContain('0 itens');
  });

  // ── totalItems() diretamente ──────────────────────────────────────────────

  it('totalItems() retorna a soma das quantidades', () => {
    const cart = makeCart(1, [
      { productId: 1, quantity: 5 },
      { productId: 2, quantity: 3 },
    ]);
    expect((comp as any).totalItems(cart)).toBe(8);
  });

  it('totalItems() retorna 0 para carrinho sem produtos', () => {
    expect((comp as any).totalItems(makeCart(1, []))).toBe(0);
  });

  // ── Abertura de modais ────────────────────────────────────────────────────

  it('abre modal de adicionar carrinho com o userId correto', () => {
    (comp as any).openAddModal();
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: { userId: USER.id } }),
    );
  });

  it('abre modal de editar carrinho com os dados do carrinho', () => {
    const cart = makeCart(10);
    (comp as any).openEditModal(cart);
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ data: cart }),
    );
  });

  it('abre modal de exclusão com título e label corretos', () => {
    const cart = makeCart(1);
    (comp as any).openDeleteModal(cart);
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Excluir carrinho',
          confirmLabel: 'Excluir',
        }),
      }),
    );
  });

  // ── Fechar modal ──────────────────────────────────────────────────────────

  it('fecha o dialog ao chamar close()', () => {
    (comp as any).close();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  // ── userFullName ──────────────────────────────────────────────────────────

  it('userFullName combina firstname e lastname', () => {
    expect((comp as any).userFullName()).toBe('João Silva');
  });
});
