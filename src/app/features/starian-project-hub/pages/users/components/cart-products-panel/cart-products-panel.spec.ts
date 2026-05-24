import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CartProductsPanelComponent } from './cart-products-panel';
import type { Product } from '@shared/interfaces/products.interface';
import type { SelectedItem } from '../../../../services/cart-form/cart-form.service';

function makeProduct(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Produto ${id}`,
    price: 10 * id,
    category: 'electronics',
    description: `Descrição ${id}`,
    image: `https://img/${id}.jpg`,
    rating: { rate: 4.5, count: 100 },
    ...overrides,
  };
}

function makeSelectedItem(id: number, quantity = 1): SelectedItem {
  return { product: makeProduct(id), quantity };
}

describe('CartProductsPanelComponent', () => {
  let fixture: ComponentFixture<CartProductsPanelComponent>;
  let comp: CartProductsPanelComponent;

  function setup(inputs: {
    productsLoading?: boolean;
    productsError?: boolean;
    filteredProducts?: Product[];
    selectedItems?: SelectedItem[];
    allProducts?: Product[];
    searchQuery?: string;
  } = {}): void {
    fixture.componentRef.setInput('productsLoading', inputs.productsLoading ?? false);
    fixture.componentRef.setInput('productsError', inputs.productsError ?? false);
    fixture.componentRef.setInput('filteredProducts', inputs.filteredProducts ?? []);
    fixture.componentRef.setInput('selectedItems', inputs.selectedItems ?? []);
    fixture.componentRef.setInput('allProducts', inputs.allProducts ?? []);
    fixture.componentRef.setInput('searchQuery', inputs.searchQuery ?? '');
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartProductsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartProductsPanelComponent);
    comp = fixture.componentInstance;
  });

  // ── Estado de loading ─────────────────────────────────────────────────────

  it('não exibe produtos quando productsLoading=true', () => {
    setup({ productsLoading: true, filteredProducts: [makeProduct(1), makeProduct(2)] });
    expect(fixture.nativeElement.querySelectorAll('.product-item')).toHaveLength(0);
  });

  it('não exibe o badge de contagem quando está carregando', () => {
    setup({ productsLoading: true, filteredProducts: [makeProduct(1)] });
    expect(fixture.nativeElement.querySelector('.cart-section__badge')).toBeNull();
  });

  it('exibe a lista de produtos quando productsLoading=false', () => {
    const products = [makeProduct(1), makeProduct(2)];
    setup({ filteredProducts: products });
    expect(fixture.nativeElement.querySelectorAll('.product-item')).toHaveLength(2);
  });

  // ── Estado de erro ────────────────────────────────────────────────────────

  it('exibe mensagem de erro quando productsError=true', () => {
    setup({ productsError: true });
    expect(fixture.nativeElement.textContent).toContain('Erro ao carregar produtos.');
    expect(fixture.nativeElement.querySelectorAll('.product-item')).toHaveLength(0);
  });

  // ── Estados vazios ────────────────────────────────────────────────────────

  it('exibe mensagem de "todos selecionados" quando filteredProducts está vazio e allProducts === selectedItems', () => {
    const p1 = makeProduct(1);
    setup({
      filteredProducts: [],
      selectedItems: [makeSelectedItem(1)],
      allProducts: [p1],
    });
    expect(fixture.nativeElement.textContent).toContain('Todos os produtos foram selecionados.');
  });

  it('exibe mensagem de "nenhum resultado" com o termo de busca quando filteredProducts está vazio e há busca', () => {
    setup({
      filteredProducts: [],
      searchQuery: 'notebook',
      allProducts: [makeProduct(1)],
    });
    expect(fixture.nativeElement.textContent).toContain('Nenhum resultado para "notebook".');
  });

  // ── Listagem de produtos disponíveis ─────────────────────────────────────

  it('renderiza o título de cada produto', () => {
    setup({ filteredProducts: [makeProduct(1)] });
    const title = fixture.nativeElement.querySelector('.product-item__title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Produto 1');
  });

  it('renderiza a categoria e o preço no meta do produto', () => {
    setup({ filteredProducts: [makeProduct(1, { category: 'clothing', price: 29.9 })] });
    const meta = fixture.nativeElement.querySelector('.product-item__meta') as HTMLElement;
    expect(meta.textContent).toContain('clothing');
    expect(meta.textContent).toContain('29.90');
  });

  it('exibe o badge com o total de produtos disponíveis', () => {
    const products = [makeProduct(1), makeProduct(2), makeProduct(3)];
    setup({ filteredProducts: products });
    const badge = fixture.nativeElement.querySelector('.cart-section__badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('3');
  });

  it('não exibe o badge quando não há produtos disponíveis', () => {
    setup({ filteredProducts: [] });
    expect(fixture.nativeElement.querySelector('.cart-section__badge')).toBeNull();
  });

  // ── Seção de itens selecionados ───────────────────────────────────────────

  it('não exibe a seção de selecionados quando selectedItems está vazio', () => {
    setup({ filteredProducts: [makeProduct(1)], selectedItems: [] });
    const section = fixture.nativeElement.querySelector('[aria-label="Produtos selecionados"]');
    expect(section).toBeNull();
  });

  it('exibe a seção de selecionados quando há itens selecionados', () => {
    setup({
      filteredProducts: [],
      selectedItems: [makeSelectedItem(1)],
      allProducts: [makeProduct(1)],
    });
    const section = fixture.nativeElement.querySelector('[aria-label="Produtos selecionados"]');
    expect(section).not.toBeNull();
  });

  it('renderiza o título do item selecionado', () => {
    setup({
      filteredProducts: [],
      selectedItems: [makeSelectedItem(3)],
      allProducts: [makeProduct(3)],
    });
    const selectedTitles = fixture.nativeElement.querySelectorAll(
      '.cart-section__list--selected .product-item__title',
    ) as NodeListOf<HTMLElement>;
    expect(selectedTitles[0].textContent?.trim()).toBe('Produto 3');
  });

  it('exibe o badge com a contagem de itens selecionados', () => {
    setup({
      filteredProducts: [],
      selectedItems: [makeSelectedItem(1), makeSelectedItem(2)],
      allProducts: [makeProduct(1), makeProduct(2)],
    });
    const badges = fixture.nativeElement.querySelectorAll(
      '.cart-section__badge',
    ) as NodeListOf<HTMLElement>;
    const lastBadge = badges[badges.length - 1];
    expect(lastBadge.textContent?.trim()).toBe('2');
  });

  // ── Eventos emitidos ──────────────────────────────────────────────────────

  it('emite removeProduct com o id do produto ao clicar em remover', () => {
    setup({
      filteredProducts: [],
      selectedItems: [makeSelectedItem(7)],
      allProducts: [makeProduct(7)],
    });
    const removedIds: number[] = [];
    comp.removeProduct.subscribe((id) => removedIds.push(id));

    const removeBtn = fixture.nativeElement.querySelector('.remove-btn') as HTMLElement;
    removeBtn.click();

    expect(removedIds).toEqual([7]);
  });

  it('emite addProduct com o produto ao clicar em Adicionar', () => {
    const product = makeProduct(5);
    setup({ filteredProducts: [product] });

    const emitted: Product[] = [];
    comp.addProduct.subscribe((p) => emitted.push(p));

    const strButton = fixture.nativeElement.querySelector('.product-item str-button') as HTMLElement;
    strButton.click();

    expect(emitted).toHaveLength(1);
    expect(emitted[0].id).toBe(5);
  });

  it('emite searchQueryChange ao alterar o valor do input de busca', () => {
    setup({});
    const emitted: string[] = [];
    comp.searchQueryChange.subscribe((v) => emitted.push(v));

    const strInputDe = fixture.debugElement.query(By.css('str-input'));
    strInputDe.triggerEventHandler('valueChange', 'teclado');

    expect(emitted).toEqual(['teclado']);
  });

  // ── Acessibilidade ────────────────────────────────────────────────────────

  it('o botão de remover tem aria-label correto', () => {
    setup({
      filteredProducts: [],
      selectedItems: [makeSelectedItem(1)],
      allProducts: [makeProduct(1)],
    });
    const removeBtn = fixture.nativeElement.querySelector('.remove-btn') as HTMLElement;
    expect(removeBtn.getAttribute('aria-label')).toContain('Remover Produto 1');
  });

  it('o botão de adicionar tem aria-label correto', () => {
    setup({ filteredProducts: [makeProduct(2)] });
    const strButton = fixture.nativeElement.querySelector('.product-item str-button') as HTMLElement;
    expect(strButton.getAttribute('aria-label')).toContain('Adicionar Produto 2');
  });
});
