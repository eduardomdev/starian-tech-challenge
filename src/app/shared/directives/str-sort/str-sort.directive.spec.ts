import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrSortDirective, type SortEvent } from './str-sort.directive';
import { StrSortGroupDirective } from './str-sort-group';

// ─── Standalone (sem grupo) ───────────────────────────────────────────────────

@Component({
  template: `
    <table><thead><tr>
      <th [strSort]="'name'" (strSortChange)="onSort($event)">Nome</th>
    </tr></thead></table>
  `,
  imports: [StrSortDirective],
})
class StandaloneHostComponent {
  events: SortEvent[] = [];
  onSort(e: SortEvent): void { this.events.push(e); }
}

describe('StrSortDirective (standalone, sem grupo)', () => {
  let fixture: ComponentFixture<StandaloneHostComponent>;
  let th: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StandaloneHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.detectChanges();
    th = fixture.nativeElement.querySelector('th');
  });

  // ── Acessibilidade ──────────────────────────────────────────────────────

  it('tem role="button" para acesso via teclado', () => {
    expect(th.getAttribute('role')).toBe('button');
  });

  it('tem tabindex="0" para ser focalizável por teclado', () => {
    expect(th.getAttribute('tabindex')).toBe('0');
  });

  it('começa com aria-sort="none"', () => {
    expect(th.getAttribute('aria-sort')).toBe('none');
  });

  // ── Ciclo de ordenação: null → asc → desc → null ─────────────────────

  it('primeiro clique: direction asc', () => {
    th.click();
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('ascending');
    expect(th.getAttribute('data-direction')).toBe('asc');
  });

  it('segundo clique: direction desc', () => {
    th.click(); th.click();
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('descending');
  });

  it('terceiro clique: volta a null (sem ordenação)', () => {
    th.click(); th.click(); th.click();
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('none');
    expect(th.getAttribute('data-direction')).toBeNull();
  });

  // ── Classe CSS ativa ────────────────────────────────────────────────────

  it('adiciona str-sort--active quando há direção definida', () => {
    th.click();
    fixture.detectChanges();
    expect(th.classList.contains('str-sort--active')).toBe(true);
  });

  it('remove str-sort--active quando volta a null', () => {
    th.click(); th.click(); th.click();
    fixture.detectChanges();
    expect(th.classList.contains('str-sort--active')).toBe(false);
  });

  // ── Eventos emitidos ────────────────────────────────────────────────────

  it('emite SortEvent com field e direction corretos a cada ciclo', () => {
    th.click();
    expect(fixture.componentInstance.events.at(-1)).toEqual({ field: 'name', direction: 'asc' });

    th.click();
    expect(fixture.componentInstance.events.at(-1)).toEqual({ field: 'name', direction: 'desc' });

    th.click();
    expect(fixture.componentInstance.events.at(-1)).toEqual({ field: 'name', direction: null });
  });

  // ── Teclado ─────────────────────────────────────────────────────────────

  it('Enter ativa a ordenação como clique', () => {
    th.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(th.getAttribute('aria-sort')).toBe('ascending');
  });

  it('Space aciona toggle e previne scroll da página', () => {
    const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
    th.dispatchEvent(event);
    fixture.detectChanges();
    expect(event.defaultPrevented).toBe(true);
    expect(th.getAttribute('aria-sort')).toBe('ascending');
  });
});

// ─── Com grupo (strSortGroup) ─────────────────────────────────────────────────

@Component({
  template: `
    <table strSortGroup>
      <thead><tr>
        <th [strSort]="'name'"  (strSortChange)="onSort($event)">Nome</th>
        <th [strSort]="'price'" (strSortChange)="onSort($event)">Preço</th>
      </tr></thead>
    </table>
  `,
  imports: [StrSortGroupDirective, StrSortDirective],
})
class GroupHostComponent {
  events: SortEvent[] = [];
  onSort(e: SortEvent): void { this.events.push(e); }
}

describe('StrSortDirective (com strSortGroup)', () => {
  let fixture: ComponentFixture<GroupHostComponent>;
  let nameTh: HTMLElement;
  let priceTh: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GroupHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(GroupHostComponent);
    fixture.detectChanges();
    [nameTh, priceTh] = fixture.nativeElement.querySelectorAll('th');
  });

  it('ativar uma coluna reseta aria-sort da outra para "none"', () => {
    nameTh.click();
    fixture.detectChanges();
    expect(nameTh.getAttribute('aria-sort')).toBe('ascending');

    priceTh.click();
    fixture.detectChanges();
    expect(nameTh.getAttribute('aria-sort')).toBe('none');
    expect(priceTh.getAttribute('aria-sort')).toBe('ascending');
  });

  it('group mantém apenas um campo ativo por vez', () => {
    nameTh.click(); fixture.detectChanges(); // name: asc
    nameTh.click(); fixture.detectChanges(); // name: desc
    priceTh.click(); fixture.detectChanges(); // price: asc, name: none

    expect(nameTh.getAttribute('aria-sort')).toBe('none');
    expect(priceTh.getAttribute('aria-sort')).toBe('ascending');
  });

  it('desativar coluna com terceiro clique não afeta a outra', () => {
    nameTh.click(); nameTh.click(); nameTh.click(); // null
    fixture.detectChanges();

    expect(nameTh.getAttribute('aria-sort')).toBe('none');
    expect(priceTh.getAttribute('aria-sort')).toBe('none');
  });
});
