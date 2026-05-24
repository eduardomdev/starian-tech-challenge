import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FilterProductsService } from './filter-products.service';
import { ProductsService } from '@shared/services/products.service';
import type { Product } from '@shared/interfaces/products.interface';

function makeProduct(id: number, title: string, category: string, price = 50): Product {
  return { id, title, price, description: '', category, image: '', rating: { rate: 4.0, count: 10 } };
}

describe('FilterProductsService', () => {
  let service: FilterProductsService;
  let productsValue: ReturnType<typeof signal<Product[] | undefined>>;

  beforeEach(() => {
    productsValue = signal<Product[] | undefined>(undefined);

    TestBed.configureTestingModule({
      providers: [
        FilterProductsService,
        {
          provide: ProductsService,
          useValue: { products: { value: productsValue } },
        },
      ],
    });

    service = TestBed.inject(FilterProductsService);
  });

  const load = (products: Product[]) => productsValue.set(products);

  // ── filteredProducts ──────────────────────────────────────────────────────

  describe('filteredProducts', () => {
    it('retorna todos os produtos quando nenhum filtro está ativo', () => {
      load([makeProduct(1, 'Fone', 'electronics'), makeProduct(2, 'Jaqueta', "men's clothing")]);
      expect(service.filteredProducts()).toHaveLength(2);
    });

    it('retorna lista vazia quando produtos ainda não foram carregados', () => {
      // productsValue = undefined
      expect(service.filteredProducts()).toHaveLength(0);
    });

    it('filtra por título (case-insensitive)', () => {
      load([
        makeProduct(1, 'Fone Bluetooth', 'electronics'),
        makeProduct(2, 'Jaqueta de Couro', "men's clothing"),
        makeProduct(3, 'Fone Cabeça', 'electronics'),
      ]);
      service.filterText.set('fone');
      expect(service.filteredProducts()).toHaveLength(2);
    });

    it('filtra por ID numérico convertido para string', () => {
      load([makeProduct(42, 'Relógio', 'electronics'), makeProduct(7, 'Jaqueta', "men's clothing")]);
      service.filterText.set('42');
      const result = service.filteredProducts();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(42);
    });

    it('filtra por categoria exclusiva', () => {
      load([
        makeProduct(1, 'Anel', 'jewelery'),
        makeProduct(2, 'Fone', 'electronics'),
        makeProduct(3, 'Colar', 'jewelery'),
      ]);
      service.filterCategories.set(['jewelery']);
      expect(service.filteredProducts()).toHaveLength(2);
    });

    it('combina filtro de texto E categoria (lógica AND)', () => {
      load([
        makeProduct(1, 'Smart Watch', 'electronics'),
        makeProduct(2, 'Smart Jaqueta', "men's clothing"),
        makeProduct(3, 'Relógio Comum', 'electronics'),
      ]);
      service.filterText.set('smart');
      service.filterCategories.set(['electronics']);
      const result = service.filteredProducts();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('retorna lista vazia quando nenhum produto corresponde', () => {
      load([makeProduct(1, 'Fone', 'electronics')]);
      service.filterText.set('xyz-inexistente');
      expect(service.filteredProducts()).toHaveLength(0);
    });

    it('ignora espaços em branco no início/fim do texto de filtro', () => {
      load([makeProduct(1, 'Notebook', 'electronics'), makeProduct(2, 'Mouse', 'electronics')]);
      service.filterText.set('  notebook  ');
      expect(service.filteredProducts()).toHaveLength(1);
    });
  });

  // ── availableCategories ───────────────────────────────────────────────────

  describe('availableCategories', () => {
    it('deduplica categorias de produtos', () => {
      load([
        makeProduct(1, 'A', 'electronics'),
        makeProduct(2, 'B', 'electronics'),
        makeProduct(3, 'C', 'jewelery'),
      ]);
      expect(service.availableCategories()).toHaveLength(2);
    });

    it('traduz categoria conhecida para o label correto', () => {
      load([makeProduct(1, 'Fone', 'electronics')]);
      const cat = service.availableCategories().find(c => c.value === 'electronics');
      expect(cat?.label).toBe('Eletronicos');
    });

    it('usa a própria chave como label para categoria desconhecida', () => {
      load([makeProduct(1, 'Item', 'categoria-nova')]);
      const cat = service.availableCategories().find(c => c.value === 'categoria-nova');
      expect(cat?.label).toBe('categoria-nova');
    });

    it('retorna lista vazia quando não há produtos', () => {
      load([]);
      expect(service.availableCategories()).toHaveLength(0);
    });
  });

  // ── hasActiveFilters ──────────────────────────────────────────────────────

  describe('hasActiveFilters', () => {
    it('é false quando nenhum filtro está ativo', () => {
      expect(service.hasActiveFilters()).toBe(false);
    });

    it('é true quando filterText é não-vazio', () => {
      service.filterText.set('busca');
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('é true quando filterCategories tem entradas', () => {
      service.filterCategories.set(['electronics']);
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('é false para filterText contendo apenas espaços', () => {
      service.filterText.set('   ');
      expect(service.hasActiveFilters()).toBe(false);
    });
  });

  // ── clearFilters ──────────────────────────────────────────────────────────

  describe('clearFilters', () => {
    it('zera texto e categorias, desativando hasActiveFilters', () => {
      service.filterText.set('busca');
      service.filterCategories.set(['electronics']);
      service.clearFilters();
      expect(service.filterText()).toBe('');
      expect(service.filterCategories()).toEqual([]);
      expect(service.hasActiveFilters()).toBe(false);
    });
  });
});
