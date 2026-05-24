import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmModalComponent, type ConfirmModalData } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let mockRef: { close: jest.MockedFunction<(result?: unknown) => void> };
  let onConfirmSpy: jest.MockedFunction<(close: () => void) => void>;
  let mockData: ConfirmModalData;

  function setup(dataOverrides: Partial<ConfirmModalData> = {}): void {
    mockRef = { close: jest.fn() };
    onConfirmSpy = jest.fn();
    mockData = {
      title: 'Confirmar ação',
      description: 'Tem certeza que deseja continuar?',
      confirmLabel: 'Confirmar',
      loading: signal(false),
      onConfirm: onConfirmSpy,
      ...dataOverrides,
    };

    TestBed.configureTestingModule({
      imports: [ConfirmModalComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: mockRef },
        { provide: DynamicDialogConfig, useValue: { data: mockData } },
      ],
    });

    fixture = TestBed.createComponent(ConfirmModalComponent);
    fixture.detectChanges();
  }

  /** Primeiro str-button → Cancelar */
  function cancelStrButton(): HTMLElement {
    return fixture.nativeElement.querySelectorAll('str-button')[0] as HTMLElement;
  }

  /** Segundo str-button → Confirmar */
  function confirmStrButton(): HTMLElement {
    return fixture.nativeElement.querySelectorAll('str-button')[1] as HTMLElement;
  }

  /** Botão nativo dentro do str-button de confirmação */
  function confirmNativeButton(): HTMLButtonElement {
    return confirmStrButton().querySelector('button') as HTMLButtonElement;
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  // ── confirm() ────────────────────────────────────────────────────────────

  it('confirm() chama o callback onConfirm com uma função de close', () => {
    setup();
    confirmStrButton().click();
    expect(onConfirmSpy).toHaveBeenCalledTimes(1);
    // Verifica que o argumento recebido é uma função
    const [closeFn] = onConfirmSpy.mock.calls[0];
    expect(typeof closeFn).toBe('function');
  });

  it('a função de close passada ao onConfirm chama ref.close(true)', () => {
    setup();
    confirmStrButton().click();
    const closeFn: () => void = onConfirmSpy.mock.calls[0][0];
    closeFn();
    expect(mockRef.close).toHaveBeenCalledWith(true);
  });

  // ── cancel() ─────────────────────────────────────────────────────────────

  it('cancel() chama ref.close(false)', () => {
    setup();
    cancelStrButton().click();
    expect(mockRef.close).toHaveBeenCalledWith(false);
  });

  it('cancel() não chama onConfirm', () => {
    setup();
    cancelStrButton().click();
    expect(onConfirmSpy).not.toHaveBeenCalled();
  });

  // ── Estado de loading via DOM ─────────────────────────────────────────────

  it('botão confirmar fica desabilitado quando loading=true', () => {
    setup({ loading: signal(true) });
    expect(confirmNativeButton().disabled).toBe(true);
  });

  it('botão confirmar fica habilitado quando loading=false', () => {
    setup({ loading: signal(false) });
    expect(confirmNativeButton().disabled).toBe(false);
  });

  // ── Conteúdo renderizado ─────────────────────────────────────────────────

  it('exibe o título passado via data', () => {
    setup({ title: 'Excluir produto' });
    const titleEl = fixture.nativeElement.querySelector('#confirm-dialog-title') as HTMLElement;
    expect(titleEl.textContent?.trim()).toBe('Excluir produto');
  });

  it('exibe a descrição passada via data', () => {
    setup({ description: 'Esta ação é irreversível.' });
    const descEl = fixture.nativeElement.querySelector('#confirm-dialog-desc') as HTMLElement;
    expect(descEl.textContent?.trim()).toBe('Esta ação é irreversível.');
  });

  it('usa o confirmLabel customizado no botão de confirmação', () => {
    setup({ confirmLabel: 'Excluir' });
    expect(confirmStrButton().textContent?.trim()).toBe('Excluir');
  });

  it('usa "Confirmar" como label padrão quando confirmLabel não é fornecido', () => {
    setup({ confirmLabel: undefined });
    expect(confirmStrButton().textContent?.trim()).toBe('Confirmar');
  });
});
