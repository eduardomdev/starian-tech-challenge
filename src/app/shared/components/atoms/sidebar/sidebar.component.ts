import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { IconComponent } from '../icon/icon';
import { SidebarItem, SidebarSection } from './sidebar.models';

@Component({
  selector: 'str-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.host--collapsed]': '!expanded()',
  },
})
export class StrSidebarComponent implements AfterViewInit {
  private router = inject(Router, { optional: true });
  private destroyRef = inject(DestroyRef);

  public sections = input<SidebarSection[]>([]);
  public footerItems = input<SidebarItem[]>([]);
  public activeRoute = input<string>('');
  public autoActiveRoute = input<boolean>(false);
  public persistKey = input<string>('str-sidebar-expanded');
  public expanded = model<boolean>(true);

  public navigate = output<string>();

  private mouseOverSidebar = signal(false);
  private openSubmenus = signal<Set<string>>(new Set());
  private routerActiveRoute = signal('');

  protected currentRoute = computed(() => {
    const fromInput = this.activeRoute();
    const fromRouter = this.routerActiveRoute();
    return fromInput || fromRouter;
  });

  private initialized = false;

  ngAfterViewInit(): void {
    const saved = localStorage.getItem(this.persistKey());
    if (saved !== null) {
      this.expanded.set(saved === 'true');
    }
    this.initialized = true;
  }

  constructor() {
    this.setupExpandedPersistence();
    this.setupRouterNavigation();
    this.setupAutoOpenSubmenus();
  }

  private setupExpandedPersistence(): void {
    effect(() => {
      const value = this.expanded();
      if (this.initialized) {
        localStorage.setItem(this.persistKey(), String(value));
      }
    });
  }

  private setupRouterNavigation(): void {
    if (this.router) {
      this.routerActiveRoute.set(this.router.url);

      this.router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(event => {
          this.routerActiveRoute.set(event.urlAfterRedirects);
        });
    }
  }

  private setupAutoOpenSubmenus(): void {
    effect(() => {
      const route = this.currentRoute();
      const sections = this.sections();
      if (!route) return;

      for (const section of sections) {
        for (const item of section.items) {
          if (!item.children?.length) continue;
          const hasActiveChild = item.children.some(child => child.route && route.startsWith(child.route));
          if (hasActiveChild) {
            this.openSubmenus.update(current => {
              const next = new Set(current);
              next.add(item.label);
              return next;
            });
          }
        }
      }
    });
  }

  protected isItemActive = computed(() => {
    const route = this.currentRoute();
    return (item: SidebarItem) => !!item.route && route.startsWith(item.route);
  });

  protected shouldShowOnHover = computed(() => {
    return !this.expanded() && this.mouseOverSidebar();
  });

  protected isSubmenuOpen(item: SidebarItem): boolean {
    return this.openSubmenus().has(item.label);
  }

  protected toggleSubmenu(item: SidebarItem): void {
    this.openSubmenus.update(current => {
      const next = new Set(current);
      next.has(item.label) ? next.delete(item.label) : next.add(item.label);
      return next;
    });
  }

  protected onItemClick(item: SidebarItem): void {
    if (item.children?.length) {
      this.toggleSubmenu(item);
      return;
    }
    if (item.route) {
      this.navigate.emit(item.route);
    }
  }

  protected onNavigate(route: string): void {
    if (route) {
      this.navigate.emit(route);
    }
  }

  protected toggleExpanded(): void {
    this.expanded.update(value => !value);
    this.mouseOverSidebar.set(false);
  }

  protected onMouseEnter(): void {
    this.mouseOverSidebar.set(true);
  }

  protected onMouseLeave(): void {
    this.mouseOverSidebar.set(false);
  }
}
