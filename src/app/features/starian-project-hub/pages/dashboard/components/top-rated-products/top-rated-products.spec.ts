import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TopRatedProductsComponent } from './top-rated-products';
import { ProductsService } from '@shared/services/products.service';
import type { Product } from '@shared/interfaces/products.interface';

function makeProduct(id: number, rate: number, count: number, price = 10): Product {
  return {
    id,
    title: `Produto ${id}`,
    price,
    category: 'electronics',
    description: '',
    image: `https://img/${id}.jpg`,
    rating: { rate, count },
  };
}

describe('TopRatedProductsComponent', () => {
  let fixture: ComponentFixture<TopRatedProductsComponent>;
  let productsValue: ReturnType<typeof signal<Product[] | undefined>>;
  let loadingValue: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    productsValue = signal<Product[] | undefined>(undefined);
    loadingValue = signal(false);

    await TestBed.configureTestingModule({
      imports: [TopRatedProductsComponent],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            products: { value: productsValue, isLoading: loadingValue },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopRatedProductsComponent);
    fixture.detectChanges();
  });

  // ── Estado de loading ────────────────────────────────────────────────────

  it('exibe skeleton quando loading=true', () => {
    loadingValue.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-top-rated-skeleton')).not.toBeNull();
    // O skeleton usa aria-busy=true para diferenciar da lista real
    const list = fixture.nativeElement.querySelector('.product-list[aria-busy="true"]');
    expect(list).not.toBeNull(); // confirmação: skeleton está visível
  });

  it('exibe a lista real (sem aria-busy) quando loading=false', () => {
    loadingValue.set(false);
    productsValue.set([makeProduct(1, 4.5, 10)]);
    fixture.detectChanges();
    // lista real tem aria-label específico, não aria-busy
    const realList = fixture.nativeElement.querySelector('[aria-label="Produtos melhor avaliados"]');
    expect(realList).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-top-rated-skeleton')).toBeNull();
  });

  // ── Ordenação dos top produtos ────────────────────────────────────────────

  it('exibe no máximo 5 produtos', () => {
    productsValue.set([
      makeProduct(1, 5.0, 10),
      makeProduct(2, 4.9, 10),
      makeProduct(3, 4.8, 10),
      makeProduct(4, 4.7, 10),
      makeProduct(5, 4.6, 10),
      makeProduct(6, 4.5, 10), // 6º deve ser excluído
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-item')).toHaveLength(5);
  });

  it('ordena pelo rate de forma descendente', () => {
    productsValue.set([
      makeProduct(1, 3.0, 10),
      makeProduct(2, 5.0, 10),
      makeProduct(3, 4.0, 10),
    ]);
    fixture.detectChanges();
    const ranks = fixture.nativeElement.querySelectorAll('.product-rank') as NodeListOf<HTMLElement>;
    // O produto 2 (rate=5.0) deve estar em 1º lugar
    const names = fixture.nativeElement.querySelectorAll('.product-name') as NodeListOf<HTMLElement>;
    expect(names[0].textContent?.trim()).toBe('Produto 2');
    expect(names[1].textContent?.trim()).toBe('Produto 3');
    expect(names[2].textContent?.trim()).toBe('Produto 1');
    expect(ranks[0].textContent?.trim()).toBe('1');
  });

  it('usa count como critério de desempate quando o rate é igual', () => {
    productsValue.set([
      makeProduct(1, 4.5, 50),
      makeProduct(2, 4.5, 200),
      makeProduct(3, 4.5, 100),
    ]);
    fixture.detectChanges();
    const names = fixture.nativeElement.querySelectorAll('.product-name') as NodeListOf<HTMLElement>;
    expect(names[0].textContent?.trim()).toBe('Produto 2'); // count=200
    expect(names[1].textContent?.trim()).toBe('Produto 3'); // count=100
    expect(names[2].textContent?.trim()).toBe('Produto 1'); // count=50
  });

  it('exibe lista vazia quando products é undefined', () => {
    productsValue.set(undefined);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-item')).toHaveLength(0);
  });

  it('exibe lista vazia quando products está vazio', () => {
    productsValue.set([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.product-item')).toHaveLength(0);
  });

  // ── Renderização de dados ─────────────────────────────────────────────────

  it('exibe o título do produto', () => {
    productsValue.set([makeProduct(1, 4.5, 10)]);
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.product-name') as HTMLElement;
    expect(name.textContent?.trim()).toBe('Produto 1');
  });

  it('numera as posições corretamente começando em 1', () => {
    productsValue.set([makeProduct(1, 5.0, 10), makeProduct(2, 4.0, 10)]);
    fixture.detectChanges();
    const ranks = fixture.nativeElement.querySelectorAll('.product-rank') as NodeListOf<HTMLElement>;
    expect(ranks[0].textContent?.trim()).toBe('1');
    expect(ranks[1].textContent?.trim()).toBe('2');
  });

  it('não muta o array original de produtos ao ordenar', () => {
    const products = [makeProduct(1, 3.0, 10), makeProduct(2, 5.0, 10)];
    productsValue.set(products);
    fixture.detectChanges();
    // O array original não deve ter sido reordenado
    expect(products[0].id).toBe(1);
    expect(products[1].id).toBe(2);
  });
});
