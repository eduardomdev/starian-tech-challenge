import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

import { UsersPageComponent } from './users';
import { UserService } from '@shared/services/user.service';
import { UserIntegrationService } from '../../services/user-integration/user-integration.service';
import type { User } from '@shared/interfaces/user.interface';

function makeUser(id: number, overrides: Partial<User> = {}): User {
  return {
    id,
    username: `user${id}`,
    email: `user${id}@test.com`,
    password: 'pass',
    name: { firstname: `Nome${id}`, lastname: `Sobrenome${id}` },
    phone: `+55 11 9999-000${id}`,
    ...overrides,
  };
}

describe('UsersPageComponent', () => {
  let fixture: ComponentFixture<UsersPageComponent>;
  let comp: UsersPageComponent;
  let usersValue: ReturnType<typeof signal<User[] | undefined>>;
  let loadingValue: ReturnType<typeof signal<boolean>>;
  let errorValue: ReturnType<typeof signal<unknown>>;
  let mockReload: jest.Mock;
  let mockDialogOpen: jest.Mock;

  beforeEach(async () => {
    usersValue = signal<User[] | undefined>(undefined);
    loadingValue = signal(false);
    errorValue = signal<unknown>(undefined);
    mockReload = jest.fn();
    mockDialogOpen = jest
      .fn()
      .mockReturnValue({ onClose: { subscribe: jest.fn() } });

    await TestBed.configureTestingModule({
      imports: [UsersPageComponent],
      providers: [
        {
          provide: UserService,
          useValue: {
            users: {
              value: usersValue,
              isLoading: loadingValue,
              error: errorValue,
              reload: mockReload,
            },
          },
        },
        {
          provide: UserIntegrationService,
          useValue: { deleteLoading: signal(false) },
        },
        {
          provide: DialogService,
          useValue: { open: mockDialogOpen },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Inicialização ─────────────────────────────────────────────────────────

  it('chama users.reload() ao inicializar', () => {
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('renderiza o cabeçalho da página', () => {
    const header = fixture.nativeElement.querySelector('.users-header') as HTMLElement;
    expect(header).not.toBeNull();
    expect(header.textContent).toContain('Usuários');
  });

  // ── Contagem e plural ─────────────────────────────────────────────────────

  it('exibe "1 usuário" no singular quando há apenas um', () => {
    usersValue.set([makeUser(1)]);
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('1 usuário');
    expect(count.textContent).not.toContain('1 usuários');
  });

  it('exibe "N usuários" no plural quando há mais de um', () => {
    usersValue.set([makeUser(1), makeUser(2), makeUser(3)]);
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('3 usuários');
  });

  it('exibe "0 usuários" quando a lista está vazia', () => {
    usersValue.set([]);
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('0 usuários');
  });

  // ── Filtragem ─────────────────────────────────────────────────────────────

  it('filtra por username (case-insensitive)', () => {
    usersValue.set([makeUser(1, { username: 'joao' }), makeUser(2, { username: 'maria' })]);
    (comp as any).filterText.set('JOAO');
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('1 usuário');
  });

  it('filtra por email', () => {
    usersValue.set([
      makeUser(1, { email: 'joao@example.com' }),
      makeUser(2, { email: 'maria@example.com' }),
    ]);
    (comp as any).filterText.set('maria');
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('1 usuário');
  });

  it('filtra por id numérico', () => {
    usersValue.set([makeUser(1), makeUser(2), makeUser(21)]);
    (comp as any).filterText.set('2');
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('2 usuários');
  });

  it('filtra por nome completo', () => {
    usersValue.set([
      makeUser(1, { name: { firstname: 'Carlos', lastname: 'Drummond' } }),
      makeUser(2, { name: { firstname: 'Ana', lastname: 'Lima' } }),
    ]);
    (comp as any).filterText.set('drummond');
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('1 usuário');
  });

  it('filtra por telefone', () => {
    usersValue.set([
      makeUser(1, { phone: '11-9999-0001' }),
      makeUser(2, { phone: '21-8888-0002' }),
    ]);
    (comp as any).filterText.set('21-');
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('1 usuário');
  });

  it('retorna todos os usuários quando filterText está vazio', () => {
    usersValue.set([makeUser(1), makeUser(2), makeUser(3)]);
    (comp as any).filterText.set('');
    fixture.detectChanges();
    const count = fixture.nativeElement.querySelector('.users-count') as HTMLElement;
    expect(count.textContent).toContain('3 usuários');
  });

  // ── Label de filtro ativo ─────────────────────────────────────────────────

  it('exibe "(filtrado)" quando há texto no filtro', () => {
    usersValue.set([makeUser(1)]);
    (comp as any).filterText.set('algo');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.users-count-filtered')).not.toBeNull();
  });

  it('não exibe "(filtrado)" quando filterText está vazio', () => {
    usersValue.set([makeUser(1)]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.users-count-filtered')).toBeNull();
  });

  it('não exibe "(filtrado)" quando filterText contém apenas espaços', () => {
    usersValue.set([makeUser(1)]);
    (comp as any).filterText.set('   ');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.users-count-filtered')).toBeNull();
  });

  // ── Abertura de modais ────────────────────────────────────────────────────

  it('abre modal de adicionar usuário ao clicar no botão', () => {
    const btn = fixture.nativeElement.querySelector('str-button') as HTMLElement;
    btn.click();
    fixture.detectChanges();
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ width: '480px' }),
    );
  });

  it('não abre nenhum modal antes de qualquer interação', () => {
    expect(mockDialogOpen).not.toHaveBeenCalled();
  });

  it('abre modal de edição com os dados do usuário', () => {
    const user = makeUser(5);
    (comp as any).openEditModal(user);
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ width: '560px', data: user }),
    );
  });

  it('abre modal de carrinhos com os dados do usuário', () => {
    const user = makeUser(3);
    (comp as any).openCartsModal(user);
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ width: '760px', data: user }),
    );
  });

  it('abre modal de exclusão com título e id do usuário', () => {
    const user = makeUser(7);
    (comp as any).openDeleteModal(user);
    expect(mockDialogOpen).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        width: '420px',
        data: expect.objectContaining({
          title: 'Excluir usuário',
          confirmLabel: 'Excluir',
        }),
      }),
    );
  });

  // ── hasActiveFilter ───────────────────────────────────────────────────────

  it('hasActiveFilter é false quando filterText está vazio', () => {
    (comp as any).filterText.set('');
    fixture.detectChanges();
    expect((comp as any).hasActiveFilter()).toBe(false);
  });

  it('hasActiveFilter é true quando filterText tem conteúdo', () => {
    (comp as any).filterText.set('busca');
    fixture.detectChanges();
    expect((comp as any).hasActiveFilter()).toBe(true);
  });
});
