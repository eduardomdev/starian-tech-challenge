import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRatingComponent } from './product-rating';

describe('ProductRatingComponent', () => {
  let fixture: ComponentFixture<ProductRatingComponent>;

  function create(rate: number, count: number): void {
    fixture = TestBed.createComponent(ProductRatingComponent);
    fixture.componentRef.setInput('rate', rate);
    fixture.componentRef.setInput('count', count);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingComponent],
    }).compileComponents();
  });

  // ── Quantidade de estrelas ───────────────────────────────────────────────

  it('renderiza sempre 5 estrelas no total', () => {
    create(3.2, 10);
    const stars = fixture.nativeElement.querySelectorAll('.star');
    expect(stars).toHaveLength(5);
  });

  it('preenche o número correto de estrelas com base no arredondamento', () => {
    // 3.7 → Math.round = 4 estrelas preenchidas
    create(3.7, 50);
    const filled = fixture.nativeElement.querySelectorAll('.star--filled');
    expect(filled).toHaveLength(4);
  });

  it('preenche 5 estrelas para avaliação máxima', () => {
    create(5, 100);
    expect(fixture.nativeElement.querySelectorAll('.star--filled')).toHaveLength(5);
  });

  it('preenche 0 estrelas para avaliação menor que 0.5 (arredonda para 0)', () => {
    create(0.4, 1);
    expect(fixture.nativeElement.querySelectorAll('.star--filled')).toHaveLength(0);
  });

  it('arredonda 2.5 para 3 estrelas', () => {
    create(2.5, 20);
    expect(fixture.nativeElement.querySelectorAll('.star--filled')).toHaveLength(3);
  });

  // ── Exibição de valores ──────────────────────────────────────────────────

  it('exibe o valor numérico da avaliação', () => {
    create(4.2, 77);
    const ratingEl = fixture.nativeElement.querySelector('.rating-value') as HTMLElement;
    expect(ratingEl.textContent?.trim()).toBe('4.2');
  });

  it('exibe a contagem de avaliações entre parênteses', () => {
    create(3.0, 99);
    const countEl = fixture.nativeElement.querySelector('.rating-count') as HTMLElement;
    expect(countEl.textContent).toContain('99');
  });

  // ── Acessibilidade ───────────────────────────────────────────────────────

  it('cada estrela tem aria-hidden="true" para não poluir leitores de tela', () => {
    create(3.0, 10);
    const stars = fixture.nativeElement.querySelectorAll('.star[aria-hidden="true"]');
    expect(stars).toHaveLength(5);
  });
});
