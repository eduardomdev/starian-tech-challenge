import { SortService } from './str-sort.service';
import type { SortEvent } from './str-sort.directive';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    service = new SortService();
  });

  // ── onSort ───────────────────────────────────────────────────────────────

  it('define field e direction ao receber um sort event com direção', () => {
    service.onSort({ field: 'name', direction: 'asc' });
    expect(service.sortField()).toBe('name');
    expect(service.sortDirection()).toBe('asc');
  });

  it('define field como null quando direction é null (ciclo de reset)', () => {
    service.onSort({ field: 'price', direction: 'asc' });
    service.onSort({ field: 'price', direction: null });
    expect(service.sortField()).toBeNull();
    expect(service.sortDirection()).toBeNull();
  });

  it('substitui o field ativo quando outro campo é ordenado', () => {
    service.onSort({ field: 'name', direction: 'asc' });
    service.onSort({ field: 'price', direction: 'desc' });
    expect(service.sortField()).toBe('price');
    expect(service.sortDirection()).toBe('desc');
  });

  it('não altera o estado quando o mesmo event é recebido sem mudança de estado', () => {
    service.onSort({ field: 'name', direction: 'desc' });
    service.onSort({ field: 'name', direction: 'desc' });
    expect(service.sortField()).toBe('name');
    expect(service.sortDirection()).toBe('desc');
  });

  // ── sort ─────────────────────────────────────────────────────────────────

  it('retorna os itens em ordem ascendente pelo campo ativo', () => {
    service.onSort({ field: 'price', direction: 'asc' });
    const items = [{ price: 30 }, { price: 10 }, { price: 20 }];
    const sorted = service.sort(items);
    expect(sorted.map(i => i.price)).toEqual([10, 20, 30]);
  });

  it('retorna os itens em ordem descendente pelo campo ativo', () => {
    service.onSort({ field: 'price', direction: 'desc' });
    const items = [{ price: 30 }, { price: 10 }, { price: 20 }];
    const sorted = service.sort(items);
    expect(sorted.map(i => i.price)).toEqual([30, 20, 10]);
  });

  it('não ordena quando sortField é null (direction null)', () => {
    service.onSort({ field: 'price', direction: null });
    const items = [{ price: 30 }, { price: 10 }];
    const result = service.sort(items);
    // sem ordenação ativa, a ordem original é mantida
    expect(result.map(i => i.price)).toEqual([30, 10]);
  });

  it('não muta o array original', () => {
    service.onSort({ field: 'price', direction: 'asc' });
    const items = [{ price: 30 }, { price: 10 }];
    const original = [...items];
    service.sort(items);
    expect(items).toEqual(original);
  });
});
