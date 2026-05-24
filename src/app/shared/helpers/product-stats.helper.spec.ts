import { computeProductStats } from './product-stats.helper';
import type { Product } from '@shared/interfaces/products.interface';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    title: 'Produto Teste',
    price: 100,
    description: '',
    category: 'electronics',
    image: '',
    rating: { rate: 4.0, count: 10 },
    ...overrides,
  };
}

describe('computeProductStats', () => {
  it('retorna zeros formatados para lista vazia', () => {
    const stats = computeProductStats([]);
    expect(stats.total).toBe('0');
    expect(stats.categories).toBe('0');
    expect(stats.avgPrice).toBe('R$ 0,00');
    expect(stats.bestRate).toBe('0');
  });

  it('conta o total de produtos corretamente', () => {
    const products = [makeProduct({ id: 1 }), makeProduct({ id: 2 }), makeProduct({ id: 3 })];
    expect(computeProductStats(products).total).toBe('3');
  });

  it('conta categorias únicas, ignorando duplicatas', () => {
    const products = [
      makeProduct({ category: 'electronics' }),
      makeProduct({ category: 'electronics' }),
      makeProduct({ category: 'jewelery' }),
      makeProduct({ category: "men's clothing" }),
    ];
    expect(computeProductStats(products).categories).toBe('3');
  });

  it('identifica a maior avaliação corretamente', () => {
    const products = [
      makeProduct({ rating: { rate: 3.0, count: 5 } }),
      makeProduct({ rating: { rate: 4.8, count: 20 } }),
      makeProduct({ rating: { rate: 2.5, count: 3 } }),
    ];
    expect(computeProductStats(products).bestRate).toBe('4.8');
  });

  it('calcula preço médio formatado em BRL', () => {
    const products = [
      makeProduct({ price: 100 }),
      makeProduct({ price: 200 }),
      makeProduct({ price: 300 }),
    ];
    const stats = computeProductStats(products);
    // média = 200
    expect(stats.avgPrice).toContain('200');
  });

  it('funciona corretamente com um único produto', () => {
    const stats = computeProductStats([makeProduct({ price: 99.9, rating: { rate: 5, count: 1 }, category: 'jewelery' })]);
    expect(stats.total).toBe('1');
    expect(stats.categories).toBe('1');
    expect(stats.bestRate).toBe('5');
  });
});
