import type { Product } from '@shared/interfaces/products.interface';

export interface ProductStats {
  total: string;
  categories: string;
  avgPrice: string;
  bestRate: string;
}

export function computeProductStats(products: Product[]): ProductStats {
  const total = products.length;

  if (total === 0) {
    return { total: '0', categories: '0', avgPrice: 'R$ 0,00', bestRate: '0' };
  }

  const categorySet = new Set<string>();
  let sumPrice = 0;
  let bestRate = -Infinity;

  for (const { category, price, rating } of products) {
    categorySet.add(category);
    sumPrice += price;
    if (rating.rate > bestRate) bestRate = rating.rate;
  }

  return {
    total: String(total),
    categories: String(categorySet.size),
    avgPrice: (sumPrice / total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    bestRate: String(bestRate),
  };
}
