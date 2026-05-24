import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrAvatarComponent } from './avatar';

describe('StrAvatarComponent', () => {
  let fixture: ComponentFixture<StrAvatarComponent>;

  function create(name: string): void {
    fixture = TestBed.createComponent(StrAvatarComponent);
    fixture.componentRef.setInput('name', name);
    fixture.detectChanges();
  }

  function initialsEl(): HTMLElement {
    return fixture.nativeElement.querySelector('.avatar-initials');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StrAvatarComponent] }).compileComponents();
  });

  // ── Cálculo das iniciais ────────────────────────────────────────────────

  it('nome de uma palavra → primeiros 2 caracteres em maiúsculo', () => {
    create('Carlos');
    expect(initialsEl().textContent?.trim()).toBe('CA');
  });

  it('nome de uma palavra curta (1 char) → único caractere em maiúsculo', () => {
    create('J');
    expect(initialsEl().textContent?.trim()).toBe('J');
  });

  it('nome com duas palavras → primeira letra de cada palavra', () => {
    create('João Silva');
    expect(initialsEl().textContent?.trim()).toBe('JS');
  });

  it('nome com três ou mais palavras → primeira letra do primeiro e do último', () => {
    create('Maria da Silva');
    expect(initialsEl().textContent?.trim()).toBe('MS');
  });

  it('produz iniciais em maiúsculo mesmo com entrada em minúsculo', () => {
    create('ana souza');
    expect(initialsEl().textContent?.trim()).toBe('AS');
  });

  it('ignora espaços extras entre as palavras', () => {
    create('  Pedro   Costa  ');
    expect(initialsEl().textContent?.trim()).toBe('PC');
  });

  // ── Acessibilidade ──────────────────────────────────────────────────────

  it('define role="img" no host para leitores de tela', () => {
    create('Ana Souza');
    expect(fixture.nativeElement.getAttribute('role')).toBe('img');
  });

  it('define aria-label com o nome completo', () => {
    create('Ana Souza');
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Ana Souza');
  });

  it('elemento de iniciais tem aria-hidden para evitar leitura duplicada', () => {
    create('Ana Souza');
    expect(initialsEl().getAttribute('aria-hidden')).toBe('true');
  });

  // ── Reatividade ──────────────────────────────────────────────────────────

  it('atualiza as iniciais quando o input name muda', () => {
    create('Ana Souza');
    expect(initialsEl().textContent?.trim()).toBe('AS');
    fixture.componentRef.setInput('name', 'Bruno Lima');
    fixture.detectChanges();
    expect(initialsEl().textContent?.trim()).toBe('BL');
  });
});
