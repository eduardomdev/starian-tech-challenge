import type { Product } from '@shared/interfaces/products.interface';

export function computeProductStats(products: Product[]): string[] {
  const total = products.length;

  if (total === 0) return ['0', '0', 'R$ 0,00', '0'];

  const categories = new Set<string>();
  let sumPrice = 0;
  let bestRate = -Infinity;

  for (const { category, price, rating } of products) {
    categories.add(category);
    sumPrice += price;
    if (rating.rate > bestRate) bestRate = rating.rate;
  }

  return [
    String(total),
    String(categories.size),
    (sumPrice / total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    String(bestRate),
  ];
}
