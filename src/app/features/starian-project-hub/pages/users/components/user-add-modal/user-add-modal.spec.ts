import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { UserAddModalComponent } from './user-add-modal';
import { UserIntegrationService } from '../../../../services/user-integration/user-integration.service';
import { ToastrService } from '@shared/components/atoms/toastr/toastr.service';

describe('UserAddModalComponent', () => {
  let fixture: ComponentFixture<UserAddModalComponent>;
  let comp: UserAddModalComponent;

  let mockClose: jest.Mock;
  let mockAdd: jest.Mock;
  let addLoading: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    mockClose = jest.fn();
    mockAdd = jest.fn();
    addLoading = signal(false);

    await TestBed.configureTestingModule({
      imports: [UserAddModalComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: mockClose } },
        {
          provide: UserIntegrationService,
          useValue: { addLoading, add: mockAdd },
        },
        {
          provide: ToastrService,
          useValue: { error: jest.fn(), success: jest.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Renderização ──────────────────────────────────────────────────────────

  it('renderiza o título "Adicionar usuário"', () => {
    const title = fixture.nativeElement.querySelector('#add-user-dialog-title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Adicionar usuário');
  });

  it('renderiza o subtítulo do formulário', () => {
    expect(fixture.nativeElement.textContent).toContain('Preencha os dados');
  });

  it('exibe o formulário quando addLoading=false', () => {
    addLoading.set(false);
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('.add-form') as HTMLElement;
    expect(form).not.toBeNull();
  });

  it('oculta o formulário e exibe skeleton quando addLoading=true', () => {
    addLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.add-form')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-user-add-skeleton')).not.toBeNull();
  });

  it('renderiza os três campos do formulário (username, email, senha)', () => {
    const inputs = fixture.nativeElement.querySelectorAll('str-input');
    expect(inputs.length).toBe(3);
  });

  it('o campo de username tem o id correto', () => {
    const usernameInput = fixture.nativeElement.querySelector('[inputid="add-username"], str-input[inputId="add-username"]');
    // verifica que o input com o id esperado está presente via atributo
    const allInputs = fixture.nativeElement.querySelectorAll('str-input');
    const ids = Array.from(allInputs as NodeListOf<HTMLElement>).map((el) =>
      el.getAttribute('inputid') ?? el.getAttribute('inputId'),
    );
    expect(ids).toContain('add-username');
    expect(ids).toContain('add-email');
    expect(ids).toContain('add-password');
  });

  // ── cancel() ─────────────────────────────────────────────────────────────

  it('cancel() fecha o dialog', () => {
    (comp as any).cancel();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('botão Cancelar chama cancel()', () => {
    const cancelSpy = jest.spyOn(comp as any, 'cancel');
    const cancelBtn = fixture.nativeElement.querySelector(
      '.add-form__actions str-button[type="button"]',
    ) as HTMLElement;
    cancelBtn.click();
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  // ── Estado de loading ─────────────────────────────────────────────────────

  it('exibe o skeleton quando addLoading muda para true', () => {
    addLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-user-add-skeleton')).not.toBeNull();
  });

  it('restaura o formulário quando addLoading volta para false', () => {
    addLoading.set(true);
    fixture.detectChanges();
    addLoading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.add-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-user-add-skeleton')).toBeNull();
  });

  // ── addForm — valores iniciais ────────────────────────────────────────────

  it('addModel inicia com username vazio', () => {
    expect((comp as any).addModel().username).toBe('');
  });

  it('addModel inicia com email vazio', () => {
    expect((comp as any).addModel().email).toBe('');
  });

  it('addModel inicia com password vazio', () => {
    expect((comp as any).addModel().password).toBe('');
  });
});
