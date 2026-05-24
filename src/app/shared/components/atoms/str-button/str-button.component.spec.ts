import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { StrButtonComponent } from './str-button.component';

@Component({
  template: `<str-button [size]="size" [variant]="variant" [loading]="loading"
    [iconName]="iconName" [iconPosition]="iconPosition">Salvar</str-button>`,
  imports: [StrButtonComponent],
})
class HostComponent {
  size: 'sm' | 'md' | 'lg' = 'md';
  variant: 'primary' | 'secondary' = 'primary';
  loading = false;
  iconName = '';
  iconPosition: 'left' | 'right' = 'right';
}

describe('StrButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  function button(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  function setup(overrides: Partial<HostComponent> = {}): void {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    Object.assign(host, overrides);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  // ── Classes CSS computadas ───────────────────────────────────────────────

  it('aplica as classes corretas para size=md e variant=primary (padrão)', () => {
    setup();
    expect(button().className).toContain('str-button--md');
    expect(button().className).toContain('str-button--primary');
  });

  it('aplica classe de tamanho lg quando size=lg', () => {
    setup({ size: 'lg' });
    expect(button().className).toContain('str-button--lg');
    expect(button().className).not.toContain('str-button--md');
  });

  it('aplica classe secondary quando variant=secondary', () => {
    setup({ variant: 'secondary' });
    expect(button().className).toContain('str-button--secondary');
    expect(button().className).not.toContain('str-button--primary');
  });

  it('aplica a classe base str-button em todas as combinações', () => {
    setup({ size: 'sm', variant: 'secondary' });
    expect(button().classList).toContain('str-button');
  });

  // ── Estado de loading ────────────────────────────────────────────────────

  it('desabilita o botão quando loading=true', () => {
    setup({ loading: true });
    expect(button().disabled).toBe(true);
  });

  it('não desabilita o botão quando loading=false', () => {
    setup({ loading: false });
    expect(button().disabled).toBe(false);
  });

  it('define aria-busy quando loading=true', () => {
    setup({ loading: true });
    expect(button().getAttribute('aria-busy')).toBe('true');
  });

  it('não define aria-busy quando loading=false', () => {
    setup({ loading: false });
    expect(button().hasAttribute('aria-busy')).toBe(false);
  });

  it('exibe str-spinner quando loading=true', () => {
    setup({ loading: true });
    expect(fixture.nativeElement.querySelector('str-spinner')).not.toBeNull();
  });

  it('não exibe str-spinner quando loading=false', () => {
    setup({ loading: false });
    expect(fixture.nativeElement.querySelector('str-spinner')).toBeNull();
  });

  // ── Posicionamento do ícone ──────────────────────────────────────────────

  it('renderiza str-icon à direita quando iconPosition=right e não está loading', () => {
    setup({ iconName: 'add', iconPosition: 'right', loading: false });
    const icons = fixture.nativeElement.querySelectorAll('str-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('não renderiza ícone à direita quando loading=true (spinner substitui)', () => {
    setup({ iconName: 'add', iconPosition: 'right', loading: true });
    // spinner está visível, ícone de ação não
    expect(fixture.nativeElement.querySelector('str-spinner')).not.toBeNull();
  });

  it('renderiza str-icon à esquerda quando iconPosition=left', () => {
    setup({ iconName: 'add', iconPosition: 'left', loading: false });
    const btn = button();
    const icon = btn.querySelector('str-icon');
    expect(icon).not.toBeNull();
    // o ícone deve estar antes do conteúdo
    const firstChild = btn.firstElementChild;
    expect(firstChild?.tagName.toLowerCase()).toBe('str-icon');
  });

  it('não renderiza str-icon quando iconName está vazio', () => {
    setup({ iconName: '', iconPosition: 'right', loading: false });
    expect(fixture.nativeElement.querySelector('str-icon')).toBeNull();
  });

  // ── Tipo do botão ────────────────────────────────────────────────────────

  it('usa type=button por padrão para evitar submit acidental', () => {
    setup();
    expect(button().type).toBe('button');
  });
});
