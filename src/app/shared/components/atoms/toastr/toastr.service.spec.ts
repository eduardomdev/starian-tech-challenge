import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastrService } from './toastr.service';

describe('ToastrService', () => {
  let service: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrService);
  });

  it('começa sem toasts', () => {
    expect(service.toasts()).toHaveLength(0);
  });

  // ── Adição de toasts ───────────────────────────────────────────────────────

  it('success() adiciona toast com type "success"', () => {
    service.success('Salvo com sucesso!');
    expect(service.toasts()).toEqual([{ type: 'success', message: 'Salvo com sucesso!' }]);
  });

  it('error() adiciona toast com type "error"', () => {
    service.error('Erro ao processar');
    expect(service.toasts()).toEqual([{ type: 'error', message: 'Erro ao processar' }]);
  });

  it('empilha múltiplos toasts na ordem de adição', () => {
    service.success('Primeiro');
    service.error('Segundo');
    const toasts = service.toasts();
    expect(toasts).toHaveLength(2);
    expect(toasts[0].message).toBe('Primeiro');
    expect(toasts[1].message).toBe('Segundo');
  });

  // ── dismiss() ─────────────────────────────────────────────────────────────

  it('dismiss() remove apenas o toast alvo, preservando os demais', () => {
    service.success('Manter');
    service.error('Remover');
    const [, toRemove] = service.toasts();
    service.dismiss(toRemove);
    expect(service.toasts()).toEqual([{ type: 'success', message: 'Manter' }]);
  });

  it('dismiss() de toast inexistente não altera a lista', () => {
    service.success('Único');
    service.dismiss({ type: 'error', message: 'inexistente' });
    expect(service.toasts()).toHaveLength(1);
  });

  // ── Auto-dismiss (setTimeout 4s) ──────────────────────────────────────────

  it('auto-dismiss após exatamente 4 segundos', fakeAsync(() => {
    service.success('Temporário');
    expect(service.toasts()).toHaveLength(1);

    tick(3999);
    expect(service.toasts()).toHaveLength(1); // ainda visível

    tick(1);
    expect(service.toasts()).toHaveLength(0); // removido
  }));

  it('cada toast tem seu próprio timer independente', fakeAsync(() => {
    service.success('Primeiro');
    tick(2000);
    service.error('Segundo');

    tick(2000); // Primeiro chega a 4s → removido
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].message).toBe('Segundo');

    tick(2000); // Segundo chega a 4s → removido
    expect(service.toasts()).toHaveLength(0);
  }));
});
