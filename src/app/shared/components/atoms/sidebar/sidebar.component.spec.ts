import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StrSidebarComponent } from './sidebar.component';
import type { SidebarItem, SidebarSection } from './sidebar.models';

const SECTIONS: SidebarSection[] = [
  {
    name: 'Principal',
    items: [
      { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
      { label: 'Produtos', route: '/products', icon: 'inventory' },
      {
        label: 'Relatórios',
        icon: 'bar_chart',
        children: [
          { label: 'Vendas', route: '/reports/sales' },
          { label: 'Estoque', route: '/reports/stock' },
        ],
      },
    ],
  },
];

describe('StrSidebarComponent', () => {
  let fixture: ComponentFixture<StrSidebarComponent>;
  let component: StrSidebarComponent;

  function create(inputs: {
    sections?: SidebarSection[];
    activeRoute?: string;
    expanded?: boolean;
    persistKey?: string;
  } = {}): void {
    fixture = TestBed.createComponent(StrSidebarComponent);
    fixture.componentRef.setInput('sections', inputs.sections ?? SECTIONS);
    if (inputs.activeRoute !== undefined) fixture.componentRef.setInput('activeRoute', inputs.activeRoute);
    if (inputs.expanded !== undefined) fixture.componentRef.setInput('expanded', inputs.expanded);
    if (inputs.persistKey !== undefined) fixture.componentRef.setInput('persistKey', inputs.persistKey);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }

  function itemButtons(): NodeListOf<HTMLButtonElement> {
    return fixture.nativeElement.querySelectorAll('.str-sidebar__item:not(.str-sidebar__item--sub)');
  }

  function getItemButton(label: string): HTMLButtonElement | null {
    const buttons = fixture.nativeElement.querySelectorAll('.str-sidebar__item');
    return Array.from(buttons).find(
      (b: HTMLButtonElement) => b.getAttribute('aria-label') === label
    ) as HTMLButtonElement | null;
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [StrSidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  // ── onItemClick: item folha emite navigate ────────────────────────────────

  it('emite navigate com a rota ao clicar em item sem filhos', () => {
    create();
    const navigateEvents: string[] = [];
    component.navigate.subscribe((r: string) => navigateEvents.push(r));

    getItemButton('Dashboard')!.click();
    expect(navigateEvents).toEqual(['/dashboard']);
  });

  it('não emite navigate ao clicar em item com filhos (parent)', () => {
    create();
    const navigateEvents: string[] = [];
    component.navigate.subscribe((r: string) => navigateEvents.push(r));

    getItemButton('Relatórios')!.click();
    expect(navigateEvents).toHaveLength(0);
  });

  // ── toggleSubmenu ────────────────────────────────────────────────────────

  it('abre o submenu ao clicar em um item com filhos', () => {
    create();
    expect(fixture.nativeElement.querySelector('.str-sidebar__submenu--open')).toBeNull();
    getItemButton('Relatórios')!.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.str-sidebar__submenu--open')).not.toBeNull();
  });

  it('fecha o submenu ao clicar novamente no mesmo item', () => {
    create();
    const relatoriosBtn = getItemButton('Relatórios')!;
    relatoriosBtn.click();
    fixture.detectChanges();
    relatoriosBtn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.str-sidebar__submenu--open')).toBeNull();
  });

  // ── isItemActive via activeRoute ─────────────────────────────────────────

  it('marca o item como ativo quando a rota corresponde ao activeRoute', () => {
    create({ activeRoute: '/products' });
    const active = fixture.nativeElement.querySelector('.str-sidebar__item--active') as HTMLElement;
    expect(active).not.toBeNull();
    expect(active.getAttribute('aria-label')).toBe('Produtos');
  });

  it('ativa itens cujo route é prefixo da rota atual (startsWith)', () => {
    create({ activeRoute: '/products/123' });
    const active = fixture.nativeElement.querySelector('.str-sidebar__item--active') as HTMLElement;
    expect(active?.getAttribute('aria-label')).toBe('Produtos');
  });

  it('não marca nenhum item como ativo quando activeRoute não corresponde', () => {
    create({ activeRoute: '/other' });
    const actives = fixture.nativeElement.querySelectorAll('.str-sidebar__item--active');
    expect(actives).toHaveLength(0);
  });

  // ── toggleExpanded ───────────────────────────────────────────────────────

  it('toggleExpanded muda o estado de expanded', () => {
    create({ expanded: true });
    expect(component.expanded()).toBe(true);
    const toggleBtn = fixture.nativeElement.querySelector('.str-sidebar__toggle') as HTMLButtonElement;
    toggleBtn.click();
    expect(component.expanded()).toBe(false);
  });

  it('aplica classe host--collapsed quando expanded=false', () => {
    create({ expanded: false });
    expect(fixture.nativeElement.classList.contains('host--collapsed')).toBe(true);
  });

  it('não aplica host--collapsed quando expanded=true', () => {
    create({ expanded: true });
    expect(fixture.nativeElement.classList.contains('host--collapsed')).toBe(false);
  });

  // ── Persistência localStorage ─────────────────────────────────────────────

  it('restaura expanded=false do localStorage ao inicializar', () => {
    localStorage.setItem('str-sidebar-expanded', 'false');
    create({ expanded: true }); // valor inicial contradiz o localStorage
    // ngAfterViewInit é chamado durante detectChanges()
    expect(component.expanded()).toBe(false);
  });

  it('restaura expanded=true do localStorage ao inicializar', () => {
    localStorage.setItem('str-sidebar-expanded', 'true');
    create({ expanded: false });
    expect(component.expanded()).toBe(true);
  });

  it('usa a persistKey customizada para ler do localStorage', () => {
    localStorage.setItem('custom-key', 'false');
    create({ expanded: true, persistKey: 'custom-key' });
    expect(component.expanded()).toBe(false);
  });

  it('não restaura quando localStorage não tem a chave', () => {
    // localStorage está limpo pelo afterEach
    create({ expanded: true });
    expect(component.expanded()).toBe(true);
  });

  // ── Auto-open submenu via activeRoute ────────────────────────────────────

  it('abre automaticamente o submenu quando a rota ativa é filha de um item pai', () => {
    create({ activeRoute: '/reports/sales' });
    fixture.detectChanges();
    const openSubmenu = fixture.nativeElement.querySelector('.str-sidebar__submenu--open');
    expect(openSubmenu).not.toBeNull();
  });

  // ── Filhos do submenu emitem navigate ────────────────────────────────────

  it('emite navigate ao clicar em item filho do submenu', () => {
    create();
    const navigateEvents: string[] = [];
    component.navigate.subscribe((r: string) => navigateEvents.push(r));

    // abre o submenu
    getItemButton('Relatórios')!.click();
    fixture.detectChanges();

    const salesBtn = getItemButton('Vendas');
    salesBtn!.click();
    expect(navigateEvents).toContain('/reports/sales');
  });
});
