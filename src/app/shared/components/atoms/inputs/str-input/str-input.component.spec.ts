import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrInputComponent } from './str-input.component';
import type { ValidationError } from '@angular/forms/signals';

type InputError = ValidationError.WithOptionalFieldTree;

describe('StrInputComponent', () => {
  let fixture: ComponentFixture<StrInputComponent>;
  let component: StrInputComponent;

  function create(inputs: {
    type?: 'text' | 'password' | 'email';
    invalid?: boolean;
    touched?: boolean;
    errors?: InputError[];
    size?: 'sm' | 'md' | 'lg';
    numbersOnly?: boolean;
    inputId?: string;
    value?: string;
  } = {}): void {
    fixture = TestBed.createComponent(StrInputComponent);
    for (const [key, val] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, val);
    }
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  function inputEl(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.str-input__field');
  }

  function toggleBtn(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.str-input__toggle');
  }

  function errorEl(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.str-input__error');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StrInputComponent] }).compileComponents();
  });

  // ── Visibilidade do toggle de senha ──────────────────────────────────────

  it('exibe botão de toggle apenas para type=password', () => {
    create({ type: 'password' });
    expect(toggleBtn()).not.toBeNull();
  });

  it('não exibe botão de toggle para type=text', () => {
    create({ type: 'text' });
    expect(toggleBtn()).toBeNull();
  });

  it('não exibe botão de toggle para type=email', () => {
    create({ type: 'email' });
    expect(toggleBtn()).toBeNull();
  });

  // ── Comportamento do toggle de senha ─────────────────────────────────────

  it('muda o type do input de password para text ao clicar no toggle', () => {
    create({ type: 'password' });
    expect(inputEl().type).toBe('password');
    toggleBtn()!.click();
    fixture.detectChanges();
    expect(inputEl().type).toBe('text');
  });

  it('volta para password ao clicar no toggle pela segunda vez', () => {
    create({ type: 'password' });
    toggleBtn()!.click();
    fixture.detectChanges();
    toggleBtn()!.click();
    fixture.detectChanges();
    expect(inputEl().type).toBe('password');
  });

  it('toggle button muda aria-label entre "Mostrar senha" e "Ocultar senha"', () => {
    create({ type: 'password' });
    expect(toggleBtn()!.getAttribute('aria-label')).toBe('Mostrar senha');
    toggleBtn()!.click();
    fixture.detectChanges();
    expect(toggleBtn()!.getAttribute('aria-label')).toBe('Ocultar senha');
  });

  it('toggle button define aria-pressed corretamente', () => {
    create({ type: 'password' });
    expect(toggleBtn()!.getAttribute('aria-pressed')).toBe('false');
    toggleBtn()!.click();
    fixture.detectChanges();
    expect(toggleBtn()!.getAttribute('aria-pressed')).toBe('true');
  });

  // ── showError: gateado por touched ───────────────────────────────────────

  it('não exibe erro quando invalid=true mas touched=false', () => {
    create({ invalid: true, touched: false });
    expect(errorEl()).toBeNull();
  });

  it('não exibe erro quando touched=true mas invalid=false', () => {
    create({ invalid: false, touched: true });
    expect(errorEl()).toBeNull();
  });

  it('exibe erro quando invalid=true E touched=true', () => {
    create({ invalid: true, touched: true });
    expect(errorEl()).not.toBeNull();
  });

  it('remove o erro da DOM quando touched volta para false', () => {
    create({ invalid: true, touched: true });
    expect(errorEl()).not.toBeNull();
    fixture.componentRef.setInput('touched', false);
    fixture.detectChanges();
    expect(errorEl()).toBeNull();
  });

  // ── Mensagem de erro ─────────────────────────────────────────────────────

  it('exibe a mensagem do primeiro erro da lista', () => {
    const errors = [
      { message: 'Campo obrigatório' },
      { message: 'Formato inválido' },
    ] as InputError[];
    create({ invalid: true, touched: true, errors });
    expect(errorEl()!.textContent?.trim()).toBe('Campo obrigatório');
  });

  it('usa fallback "Campo inválido" quando errors está vazio', () => {
    create({ invalid: true, touched: true, errors: [] });
    expect(errorEl()!.textContent?.trim()).toBe('Campo inválido');
  });

  it('error span tem role="alert" para acessibilidade', () => {
    create({ invalid: true, touched: true });
    expect(errorEl()!.getAttribute('role')).toBe('alert');
  });

  // ── Atributos ARIA no input ──────────────────────────────────────────────

  it('define aria-invalid no input quando showError é true', () => {
    create({ invalid: true, touched: true });
    expect(inputEl().getAttribute('aria-invalid')).toBe('true');
  });

  it('não define aria-invalid quando showError é false', () => {
    create({ invalid: true, touched: false });
    expect(inputEl().hasAttribute('aria-invalid')).toBe(false);
  });

  it('define aria-describedby quando showError e inputId estão definidos', () => {
    create({ invalid: true, touched: true, inputId: 'my-input' });
    expect(inputEl().getAttribute('aria-describedby')).toBe('my-input-error');
    expect(errorEl()!.id).toBe('my-input-error');
  });

  // ── onBlur define touched ────────────────────────────────────────────────

  it('define touched=true ao disparar blur no input', () => {
    create({ touched: false });
    expect(component.touched()).toBe(false);
    inputEl().dispatchEvent(new FocusEvent('blur'));
    expect(component.touched()).toBe(true);
  });

  // ── Alturas por tamanho ──────────────────────────────────────────────────

  it('aplica height 32px para size=sm', () => {
    create({ size: 'sm' });
    expect(inputEl().style.height).toBe('32px');
  });

  it('aplica height 40px para size=md (padrão)', () => {
    create({ size: 'md' });
    expect(inputEl().style.height).toBe('40px');
  });

  it('aplica height 48px para size=lg', () => {
    create({ size: 'lg' });
    expect(inputEl().style.height).toBe('48px');
  });

  // ── onInput atualiza value ───────────────────────────────────────────────

  it('atualiza o signal value ao digitar no input', () => {
    create();
    const el = inputEl();
    el.value = 'teste';
    el.dispatchEvent(new Event('input'));
    expect(component.value()).toBe('teste');
  });
});
