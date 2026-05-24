import { getNestedValue, sortByField } from './sort.utils';

// ─── getNestedValue ───────────────────────────────────────────────────────────

describe('getNestedValue', () => {
  it('retorna valor de campo raiz', () => {
    expect(getNestedValue({ name: 'Alice' }, 'name')).toBe('Alice');
  });

  it('resolve caminho aninhado com pontos', () => {
    expect(getNestedValue({ rating: { rate: 4.5 } }, 'rating.rate')).toBe(4.5);
  });

  it('retorna undefined para caminho inexistente', () => {
    expect(getNestedValue({}, 'a.b.c')).toBeUndefined();
  });

  it('lida com valor numérico zero sem confundir com falsy', () => {
    expect(getNestedValue({ price: 0 }, 'price')).toBe(0);
  });
});

// ─── sortByField ─────────────────────────────────────────────────────────────

describe('sortByField', () => {
  const products = [
    { title: 'Camiseta', price: 49 },
    { title: 'Anel',     price: 320 },
    { title: 'Notebook', price: 3200 },
  ];

  it('ordena ascendente por string', () => {
    const result = sortByField(products, 'title', 'asc');
    expect(result.map(p => p.title)).toEqual(['Anel', 'Camiseta', 'Notebook']);
  });

  it('ordena descendente por número', () => {
    const result = sortByField(products, 'price', 'desc');
    expect(result.map(p => p.price)).toEqual([3200, 320, 49]);
  });

  it('retorna referência original quando direction é null', () => {
    expect(sortByField(products, 'title', null)).toBe(products);
  });

  it('retorna referência original quando field está vazio', () => {
    expect(sortByField(products, '', 'asc')).toBe(products);
  });

  it('não muta o array original', () => {
    const original = [...products];
    sortByField(products, 'price', 'asc');
    expect(products).toEqual(original);
  });

  it('ordena por campo aninhado', () => {
    const items = [
      { info: { score: 3 } },
      { info: { score: 1 } },
      { info: { score: 2 } },
    ];
    expect(sortByField(items, 'info.score', 'asc').map(i => i.info.score)).toEqual([1, 2, 3]);
  });

  it('ordenação estável: iguais mantêm posição relativa', () => {
    const tied = [
      { label: 'A', value: 10 },
      { label: 'B', value: 10 },
    ];
    const result = sortByField(tied, 'value', 'asc');
    expect(result.map(i => i.label)).toEqual(['A', 'B']);
  });
});
