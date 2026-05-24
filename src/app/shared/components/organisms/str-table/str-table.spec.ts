import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './str-table';

interface Row { id: number; name: string; }

@Component({
  template: `
    <str-table
      [data]="items"
      [loading]="loading"
      [errorLoading]="error"
      [emptyText]="emptyText"
      [skeletonRowCount]="skeletonCount"
      [caption]="caption"
    >
      <ng-template #headerTemplate>
        <th class="col-name">Nome</th>
      </ng-template>
      <ng-template #itemTemplate let-item>
        <tr>
          <td class="item-name">{{ item.name }}</td>
        </tr>
      </ng-template>
      <ng-template #errorTemplate>
        <p class="custom-error">Erro personalizado</p>
      </ng-template>
      <ng-template #emptyDataTemplate>
        <p class="custom-empty">Lista vazia personalizada</p>
      </ng-template>
      <ng-template #toolbarTemplate>
        <button class="toolbar-btn">Adicionar</button>
      </ng-template>
    </str-table>
  `,
  imports: [TableComponent],
})
class HostComponent {
  items: Row[] = [];
  loading = false;
  error = false;
  emptyText = 'Nenhum dado disponível no momento';
  skeletonCount = 6;
  caption: string | undefined = undefined;
}

@Component({
  template: `
    <str-table [data]="items" [loading]="loading" [errorLoading]="error" [emptyText]="emptyText">
      <ng-template #headerTemplate><th>Nome</th></ng-template>
      <ng-template #itemTemplate let-item>
        <tr><td class="item-name">{{ item.name }}</td></tr>
      </ng-template>
    </str-table>
  `,
  imports: [TableComponent],
})
class MinimalHostComponent {
  items: Row[] = [];
  loading = false;
  error = false;
  emptyText = 'Sem dados';
}

describe('TableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  function setup(overrides: Partial<HostComponent> = {}): void {
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    Object.assign(host, overrides);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, MinimalHostComponent],
    }).compileComponents();
  });

  // ── aria-busy ────────────────────────────────────────────────────────────

  it('define aria-busy=true quando loading', () => {
    setup({ loading: true });
    const tableEl = fixture.nativeElement.querySelector('str-table');
    expect(tableEl.getAttribute('aria-busy')).toBe('true');
  });

  it('define aria-busy=false quando não está carregando', () => {
    setup({ loading: false });
    const tableEl = fixture.nativeElement.querySelector('str-table');
    expect(tableEl.getAttribute('aria-busy')).toBe('false');
  });

  // ── Estado de loading ─────────────────────────────────────────────────────

  it('renderiza o número correto de linhas skeleton durante loading', () => {
    setup({ loading: true, skeletonCount: 4 });
    const skeletonRows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(skeletonRows).toHaveLength(4);
  });

  it('usa skeletonRowCount=6 por padrão', () => {
    setup({ loading: true });
    const skeletonRows = fixture.nativeElement.querySelectorAll('.skeleton-row');
    expect(skeletonRows).toHaveLength(6);
  });

  it('não renderiza itens durante loading', () => {
    setup({ loading: true, items: [{ id: 1, name: 'Produto A' }] });
    expect(fixture.nativeElement.querySelectorAll('.item-name')).toHaveLength(0);
  });

  // ── Estado de erro ────────────────────────────────────────────────────────

  it('renderiza o template de erro customizado quando errorLoading=true', () => {
    setup({ error: true });
    expect(fixture.nativeElement.querySelector('.custom-error')).not.toBeNull();
  });

  it('não renderiza itens durante estado de erro', () => {
    setup({ error: true, items: [{ id: 1, name: 'X' }] });
    expect(fixture.nativeElement.querySelectorAll('.item-name')).toHaveLength(0);
  });

  // ── Estado vazio ──────────────────────────────────────────────────────────

  it('renderiza template de empty customizado quando data=[]', () => {
    setup({ items: [] });
    expect(fixture.nativeElement.querySelector('.custom-empty')).not.toBeNull();
  });

  it('usa o emptyText padrão quando não há emptyDataTemplate', () => {
    const minFixture = TestBed.createComponent(MinimalHostComponent);
    const minHost = minFixture.componentInstance;
    minHost.items = [];
    minHost.emptyText = 'Produto não encontrado';
    minFixture.detectChanges();
    const emptyTitle = minFixture.nativeElement.querySelector('.empty-title') as HTMLElement;
    expect(emptyTitle.textContent?.trim()).toBe('Produto não encontrado');
  });

  // ── Renderização de itens ─────────────────────────────────────────────────

  it('renderiza todas as linhas quando data não está vazio', () => {
    setup({
      items: [
        { id: 1, name: 'Alpha' },
        { id: 2, name: 'Beta' },
        { id: 3, name: 'Gamma' },
      ],
    });
    const rows = fixture.nativeElement.querySelectorAll('.item-name');
    expect(rows).toHaveLength(3);
    expect((rows[0] as HTMLElement).textContent?.trim()).toBe('Alpha');
    expect((rows[2] as HTMLElement).textContent?.trim()).toBe('Gamma');
  });

  it('renderiza o número exato de linhas correspondente ao tamanho dos dados', () => {
    setup({ items: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' }] });
    expect(fixture.nativeElement.querySelectorAll('.item-name')).toHaveLength(3);
    // Garante que não há itens extras ou faltando
    const rows = fixture.nativeElement.querySelectorAll('.item-name') as NodeListOf<HTMLElement>;
    expect(rows[0].textContent?.trim()).toBe('A');
    expect(rows[2].textContent?.trim()).toBe('C');
  });

  // ── Caption ───────────────────────────────────────────────────────────────

  it('renderiza caption quando definido', () => {
    setup({ caption: 'Lista de Produtos' });
    const caption = fixture.nativeElement.querySelector('caption') as HTMLElement;
    expect(caption).not.toBeNull();
    expect(caption.textContent?.trim()).toBe('Lista de Produtos');
  });

  it('não renderiza caption quando não definido', () => {
    setup({ caption: undefined });
    expect(fixture.nativeElement.querySelector('caption')).toBeNull();
  });

  // ── Toolbar template ──────────────────────────────────────────────────────

  it('renderiza o toolbarTemplate quando fornecido', () => {
    setup({ items: [{ id: 1, name: 'X' }] });
    expect(fixture.nativeElement.querySelector('.toolbar-btn')).not.toBeNull();
  });

  // ── Header template ───────────────────────────────────────────────────────

  it('renderiza o headerTemplate no thead', () => {
    setup();
    const th = fixture.nativeElement.querySelector('thead .col-name') as HTMLElement;
    expect(th).not.toBeNull();
    expect(th.textContent?.trim()).toBe('Nome');
  });
});
