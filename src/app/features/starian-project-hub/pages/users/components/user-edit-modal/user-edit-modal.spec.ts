import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { UserEditModalComponent } from './user-edit-modal';
import { UserIntegrationService } from '../../../../services/user-integration/user-integration.service';
import type { User } from '@shared/interfaces/user.interface';

const USER: User = {
  id: 8,
  username: 'jdoe',
  email: 'jdoe@test.com',
  password: 'secret123',
  name: { firstname: 'John', lastname: 'Doe' },
};

describe('UserEditModalComponent', () => {
  let fixture: ComponentFixture<UserEditModalComponent>;
  let comp: UserEditModalComponent;

  let mockClose: jest.Mock;
  let mockUpdate: jest.Mock;
  let updateLoading: ReturnType<typeof signal<boolean>>;

  beforeEach(async () => {
    mockClose = jest.fn();
    mockUpdate = jest.fn();
    updateLoading = signal(false);

    await TestBed.configureTestingModule({
      imports: [UserEditModalComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: { close: mockClose } },
        { provide: DynamicDialogConfig, useValue: { data: USER } },
        {
          provide: UserIntegrationService,
          useValue: { updateLoading, update: mockUpdate },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditModalComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Renderização ──────────────────────────────────────────────────────────

  it('renderiza o título "Editar usuário"', () => {
    const title = fixture.nativeElement.querySelector('#edit-user-dialog-title') as HTMLElement;
    expect(title.textContent?.trim()).toBe('Editar usuário');
  });

  it('exibe o id do usuário no subtítulo', () => {
    const subtitle = fixture.nativeElement.querySelector('.subtitle-font-14') as HTMLElement;
    expect(subtitle.textContent).toContain('#8');
  });

  it('exibe o formulário quando updateLoading=false', () => {
    updateLoading.set(false);
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('.edit-form') as HTMLElement;
    expect(form).not.toBeNull();
  });

  it('oculta o formulário e exibe skeleton quando updateLoading=true', () => {
    updateLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.edit-form')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-user-edit-skeleton')).not.toBeNull();
  });

  it('renderiza os três campos do formulário (username, email, senha)', () => {
    const inputs = fixture.nativeElement.querySelectorAll('str-input');
    expect(inputs.length).toBe(3);
  });

  it('os campos têm os ids corretos', () => {
    const allInputs = fixture.nativeElement.querySelectorAll('str-input');
    const ids = Array.from(allInputs as NodeListOf<HTMLElement>).map(
      (el) => el.getAttribute('inputid') ?? el.getAttribute('inputId'),
    );
    expect(ids).toContain('edit-username');
    expect(ids).toContain('edit-email');
    expect(ids).toContain('edit-password');
  });

  // ── Pré-preenchimento com dados do usuário ─────────────────────────────────

  it('editModel é pré-preenchido com o username do usuário', () => {
    expect((comp as any).editModel().username).toBe(USER.username);
  });

  it('editModel é pré-preenchido com o email do usuário', () => {
    expect((comp as any).editModel().email).toBe(USER.email);
  });

  it('editModel é pré-preenchido com o password do usuário', () => {
    expect((comp as any).editModel().password).toBe(USER.password);
  });

  // ── cancel() ─────────────────────────────────────────────────────────────

  it('cancel() fecha o dialog', () => {
    (comp as any).cancel();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('botão Cancelar chama cancel()', () => {
    const cancelSpy = jest.spyOn(comp as any, 'cancel');
    const cancelBtn = fixture.nativeElement.querySelector(
      '.edit-form__actions str-button[type="button"]',
    ) as HTMLElement;
    cancelBtn.click();
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  // ── Estado de loading ─────────────────────────────────────────────────────

  it('exibe o skeleton quando updateLoading muda para true', () => {
    updateLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-user-edit-skeleton')).not.toBeNull();
  });

  it('restaura o formulário quando updateLoading volta para false', () => {
    updateLoading.set(true);
    fixture.detectChanges();
    updateLoading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.edit-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-user-edit-skeleton')).toBeNull();
  });

  // ── user recebido via config ──────────────────────────────────────────────

  it('expõe o user passado via DynamicDialogConfig', () => {
    expect((comp as any).user.id).toBe(USER.id);
    expect((comp as any).user.username).toBe(USER.username);
  });
});
