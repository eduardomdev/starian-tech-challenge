import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrMultiSelectComponent, type StrMultiSelectOption } from './str-multi-select.component';

const OPTIONS: StrMultiSelectOption[] = [
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Joias', value: 'jewelery' },
  { label: 'Roupas Masculinas', value: 'mens' },
];

describe('StrMultiSelectComponent', () => {
  let fixture: ComponentFixture<StrMultiSelectComponent>;
  let component: StrMultiSelectComponent;

  function create(inputs: {
    options?: StrMultiSelectOption[];
    value?: string[];
    disabled?: boolean;
    placeholder?: string;
  } = {}): void {
    fixture = TestBed.createComponent(StrMultiSelectComponent);
    fixture.componentRef.setInput('options', inputs.options ?? OPTIONS);
    if (inputs.value !== undefined) fixture.componentRef.setInput('value', inputs.value);
    if (inputs.disabled !== undefined) fixture.componentRef.setInput('disabled', inputs.disabled);
    if (inputs.placeholder !== undefined) fixture.componentRef.setInput('placeholder', inputs.placeholder);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  function triggerBtn(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.str-ms-trigger');
  }

  function dropdown(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.str-ms-dropdown');
  }

  function badge(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.str-ms-badge');
  }

  function clearBtn(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.str-ms-clear-btn');
  }

  function checkboxes(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll('.str-ms-checkbox');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StrMultiSelectComponent] }).compileComponents();
  });

  // ── Abertura e fechamento ────────────────────────────────────────────────

  it('abre o dropdown ao clicar no trigger', () => {
    create();
    expect(dropdown()).toBeNull();
    triggerBtn().click();
    fixture.detectChanges();
    expect(dropdown()).not.toBeNull();
  });

  it('fecha o dropdown ao clicar no trigger novamente', () => {
    create();
    triggerBtn().click();
    fixture.detectChanges();
    triggerBtn().click();
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  it('não abre o dropdown quando disabled=true', () => {
    create({ disabled: true });
    triggerBtn().click();
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  it('desabilita o botão trigger quando disabled=true', () => {
    create({ disabled: true });
    expect(triggerBtn().disabled).toBe(true);
  });

  it('fecha o dropdown ao pressionar Escape', () => {
    create();
    triggerBtn().click();
    fixture.detectChanges();
    const drop = dropdown()!;
    drop.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(dropdown()).toBeNull();
  });

  // ── toggleOption: adição e remoção ────────────────────────────────────────

  it('adiciona valor ao selecionar uma opção não selecionada', () => {
    create({ value: [] });
    triggerBtn().click();
    fixture.detectChanges();
    checkboxes()[0].dispatchEvent(new Event('change'));
    expect(component.value()).toContain('electronics');
  });

  it('remove valor ao desmarcar uma opção já selecionada', () => {
    create({ value: ['electronics', 'jewelery'] });
    triggerBtn().click();
    fixture.detectChanges();
    checkboxes()[0].dispatchEvent(new Event('change'));
    expect(component.value()).not.toContain('electronics');
    expect(component.value()).toContain('jewelery');
  });

  it('mantém as demais seleções ao desmarcar uma opção', () => {
    create({ value: ['electronics', 'jewelery', 'mens'] });
    triggerBtn().click();
    fixture.detectChanges();
    checkboxes()[1].dispatchEvent(new Event('change'));
    expect(component.value()).toEqual(['electronics', 'mens']);
  });

  // ── clearAll ──────────────────────────────────────────────────────────────

  it('remove todas as seleções ao clicar em Limpar', () => {
    create({ value: ['electronics', 'jewelery'] });
    triggerBtn().click();
    fixture.detectChanges();
    clearBtn()!.click();
    fixture.detectChanges();
    expect(component.value()).toEqual([]);
  });

  it('o botão Limpar está desabilitado quando nenhuma opção está selecionada', () => {
    create({ value: [] });
    triggerBtn().click();
    fixture.detectChanges();
    expect(clearBtn()!.disabled).toBe(true);
  });

  it('o botão Limpar está habilitado quando há ao menos uma seleção', () => {
    create({ value: ['electronics'] });
    triggerBtn().click();
    fixture.detectChanges();
    expect(clearBtn()!.disabled).toBe(false);
  });

  // ── Badge de contagem ─────────────────────────────────────────────────────

  it('exibe o badge com a contagem de opções selecionadas', () => {
    create({ value: ['electronics', 'jewelery'] });
    expect(badge()).not.toBeNull();
    expect(badge()!.textContent?.trim()).toBe('2');
  });

  it('não exibe o badge quando nenhuma opção está selecionada', () => {
    create({ value: [] });
    expect(badge()).toBeNull();
  });

  it('atualiza a contagem do badge ao adicionar uma opção', () => {
    create({ value: ['electronics'] });
    triggerBtn().click();
    fixture.detectChanges();
    checkboxes()[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(badge()!.textContent?.trim()).toBe('2');
  });

  // ── isSelected refletido nos checkboxes ──────────────────────────────────

  it('marca o checkbox como checked para opções pré-selecionadas', () => {
    create({ value: ['jewelery'] });
    triggerBtn().click();
    fixture.detectChanges();
    const boxes = checkboxes();
    expect(boxes[0].checked).toBe(false); // electronics
    expect(boxes[1].checked).toBe(true);  // jewelery
    expect(boxes[2].checked).toBe(false); // mens
  });

  // ── Clique fora fecha o dropdown ─────────────────────────────────────────

  it('fecha o dropdown ao clicar fora do componente', () => {
    create();
    triggerBtn().click();
    fixture.detectChanges();
    expect(dropdown()).not.toBeNull();

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(dropdown()).toBeNull();
    outside.remove();
  });

  it('não fecha o dropdown ao clicar dentro do componente', () => {
    create();
    triggerBtn().click();
    fixture.detectChanges();
    fixture.nativeElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(dropdown()).not.toBeNull();
  });

  // ── Aria ─────────────────────────────────────────────────────────────────

  it('define aria-expanded no trigger conforme estado do dropdown', () => {
    create();
    expect(triggerBtn().getAttribute('aria-expanded')).toBe('false');
    triggerBtn().click();
    fixture.detectChanges();
    expect(triggerBtn().getAttribute('aria-expanded')).toBe('true');
  });

  it('aria-label do trigger menciona a contagem quando há seleções', () => {
    create({ value: ['electronics'], placeholder: 'Categorias' });
    const ariaLabel = triggerBtn().getAttribute('aria-label');
    expect(ariaLabel).toContain('1');
    expect(ariaLabel).toContain('selecionada');
  });
});
