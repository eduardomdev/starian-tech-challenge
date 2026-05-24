import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { ValidationError } from '@angular/forms/signals';
import { StrSelectComponent, type StrSelectOption } from './str-select.component';

type SelectError = ValidationError.WithOptionalFieldTree;

const OPTIONS: StrSelectOption[] = [
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Joias', value: 'jewelery' },
  { label: 'Roupas', value: 'clothing' },
];

describe('StrSelectComponent', () => {
  let fixture: ComponentFixture<StrSelectComponent>;
  let component: StrSelectComponent;

  function create(inputs: {
    options?: StrSelectOption[];
    value?: string;
    invalid?: boolean;
    touched?: boolean;
    disabled?: boolean;
    errors?: SelectError[];
  } = {}): void {
    fixture = TestBed.createComponent(StrSelectComponent);
    fixture.componentRef.setInput('options', inputs.options ?? OPTIONS);
    if (inputs.value !== undefined) fixture.componentRef.setInput('value', inputs.value);
    if (inputs.invalid !== undefined) fixture.componentRef.setInput('invalid', inputs.invalid);
    if (inputs.touched !== undefined) fixture.componentRef.setInput('touched', inputs.touched);
    if (inputs.disabled !== undefined) fixture.componentRef.setInput('disabled', inputs.disabled);
    if (inputs.errors !== undefined) fixture.componentRef.setInput('errors', inputs.errors);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  function trigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.str-select__trigger');
  }

  function dropdown(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.str-select__dropdown');
  }

  function optionItems(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('[role="option"]');
  }

  function errorEl(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.str-select__error');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StrSelectComponent] }).compileComponents();
  });

  // ── Abertura e fechamento ────────────────────────────────────────────────

  it('abre o dropdown ao clicar no trigger', () => {
    create();
    expect(dropdown()).toBeNull();
    trigger().click();
    fixture.detectChanges();
    expect(dropdown()).not.toBeNull();
  });

  it('fecha o dropdown ao clicar no trigger novamente', () => {
    create();
    trigger().click();
    fixture.detectChanges();
    trigger().click();
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  it('não abre quando disabled=true', () => {
    create({ disabled: true });
    trigger().click();
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  it('botão trigger é desabilitado quando disabled=true', () => {
    create({ disabled: true });
    expect(trigger().disabled).toBe(true);
  });

  it('fecha o dropdown ao pressionar Escape', () => {
    create();
    trigger().click();
    fixture.detectChanges();
    trigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  // ── Seleção de opção ──────────────────────────────────────────────────────

  it('define o valor ao clicar em uma opção', () => {
    create();
    trigger().click();
    fixture.detectChanges();
    (optionItems()[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.value()).toBe('jewelery');
  });

  it('fecha o dropdown após selecionar uma opção', () => {
    create();
    trigger().click();
    fixture.detectChanges();
    (optionItems()[0] as HTMLElement).click();
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  it('define touched=true ao selecionar uma opção', () => {
    create({ touched: false });
    trigger().click();
    fixture.detectChanges();
    (optionItems()[0] as HTMLElement).click();
    expect(component.touched()).toBe(true);
  });

  it('marca a opção selecionada com aria-selected="true"', () => {
    create({ value: 'jewelery' });
    trigger().click();
    fixture.detectChanges();
    const selected = fixture.nativeElement.querySelector('[aria-selected="true"]');
    expect(selected).not.toBeNull();
    expect((selected as HTMLElement).textContent?.trim()).toBe('Joias');
  });

  // ── selectedLabel ────────────────────────────────────────────────────────

  it('exibe o label da opção selecionada no trigger', () => {
    create({ value: 'electronics' });
    const text = fixture.nativeElement.querySelector('.str-select__trigger-text') as HTMLElement;
    expect(text.textContent?.trim()).toBe('Eletrônicos');
  });

  it('exibe o placeholder quando nenhuma opção está selecionada', () => {
    create({ value: '' });
    const text = fixture.nativeElement.querySelector('.str-select__trigger-text') as HTMLElement;
    expect(text.textContent?.trim()).toBe('Selecione uma opção');
  });

  // ── showError gateado por touched ────────────────────────────────────────

  it('não exibe erro quando invalid=true mas touched=false', () => {
    create({ invalid: true, touched: false });
    expect(errorEl()).toBeNull();
  });

  it('exibe erro quando invalid=true E touched=true', () => {
    create({ invalid: true, touched: true });
    expect(errorEl()).not.toBeNull();
  });

  it('error element tem role="alert"', () => {
    create({ invalid: true, touched: true });
    expect(errorEl()!.getAttribute('role')).toBe('alert');
  });

  it('exibe mensagem do primeiro erro', () => {
    create({ invalid: true, touched: true, errors: [{ message: 'Campo obrigatório' }] });
    expect(errorEl()!.textContent?.trim()).toBe('Campo obrigatório');
  });

  // ── Clique fora fecha o dropdown ─────────────────────────────────────────

  it('fecha o dropdown e define touched ao clicar fora do componente', () => {
    create({ touched: false });
    trigger().click();
    fixture.detectChanges();
    expect(dropdown()).not.toBeNull();

    // simula clique em elemento externo ao componente
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(dropdown()).toBeNull();
    expect(component.touched()).toBe(true);

    outside.remove();
  });

  it('não fecha o dropdown ao clicar dentro do componente', () => {
    create();
    trigger().click();
    fixture.detectChanges();

    // clique dentro do próprio componente
    fixture.nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(dropdown()).not.toBeNull();
  });

  // ── Aria no trigger ──────────────────────────────────────────────────────

  it('define aria-expanded="false" quando fechado', () => {
    create();
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('define aria-expanded="true" quando aberto', () => {
    create();
    trigger().click();
    fixture.detectChanges();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  // ── Lista vazia ───────────────────────────────────────────────────────────

  it('exibe "Nenhuma opção disponível" quando options está vazio', () => {
    create({ options: [] });
    trigger().click();
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.str-select__empty') as HTMLElement;
    expect(empty).not.toBeNull();
    expect(empty.textContent?.trim()).toBe('Nenhuma opção disponível');
  });
});
