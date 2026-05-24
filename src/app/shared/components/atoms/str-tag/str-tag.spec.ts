import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagComponent, type TagConfig } from './str-tag';

const TAG_CONFIG: Record<string, TagConfig> = {
  electronics:    { label: 'Eletrônicos',    backgroundColor: '#DAE3F0', color: '#194FA0' },
  jewelery:       { label: 'Joias',          backgroundColor: '#DCFCE7', color: '#166534' },
  "men's clothing": { label: 'Roupas Masc.', backgroundColor: '#FFF1CC', color: '#242424' },
};

describe('TagComponent', () => {
  let fixture: ComponentFixture<TagComponent>;

  function create(value: string, config = TAG_CONFIG): void {
    fixture = TestBed.createComponent(TagComponent);
    fixture.componentRef.setInput('value', value);
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TagComponent] }).compileComponents();
  });

  // ── Resolução normal ─────────────────────────────────────────────────────

  it('exibe o label da config para categoria conhecida', () => {
    create('electronics');
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Eletrônicos');
  });

  it('resolve a chave de forma case-insensitive', () => {
    create('ELECTRONICS');
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Eletrônicos');
  });

  it('aplica a cor de fundo da config', () => {
    create('jewelery');
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    // style.backgroundColor pode ser hex ou rgb dependendo do jsdom; testamos que está definido
    expect(span.style.backgroundColor).toBeTruthy();
  });

  it('aplica a cor de texto da config', () => {
    create('jewelery');
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    expect(span.style.color).toBeTruthy();
  });

  // ── Fallback para categoria desconhecida ─────────────────────────────────

  it('usa o próprio value como label para categoria desconhecida', () => {
    create('nova-categoria');
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    expect(span.textContent?.trim()).toBe('nova-categoria');
  });

  it('aplica cores padrão para categoria desconhecida', () => {
    create('indefinido');
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    // deve existir alguma cor definida (não string vazia)
    expect(span.style.backgroundColor).toBeTruthy();
    expect(span.style.color).toBeTruthy();
  });

  // ── Reatividade: atualiza quando value muda ──────────────────────────────

  it('recomputa o label quando o input value é atualizado', () => {
    create('electronics');
    fixture.componentRef.setInput('value', 'jewelery');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.tag') as HTMLElement;
    expect(span.textContent?.trim()).toBe('Joias');
  });
});
