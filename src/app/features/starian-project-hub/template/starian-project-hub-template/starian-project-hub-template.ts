import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StrSidebarComponent } from '../../../../shared/components/atoms/sidebar/sidebar.component';
import { SidebarSection, SidebarItem } from '../../../../shared/components/atoms/sidebar/sidebar.models';
import { STARIAN_PROJECT_HUB_SECTIONS, STARIAN_PROJECT_HUB_FOOTER_ITEMS } from '../../../../core/constants/starian-project-hub.constants';
import { StrBreadcrumbComponent } from '../../../../shared/components/atoms/breadcrumb/breadcrumb';
import { StrAvatarComponent } from '../../../../shared/components/atoms/avatar/avatar';
import { BreadcrumbService } from '../../../../shared/components/atoms/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-starian-project-hub-template',
  imports: [RouterOutlet, StrSidebarComponent, StrBreadcrumbComponent, StrAvatarComponent],
  templateUrl: './starian-project-hub-template.html',
  styleUrl: './starian-project-hub-template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarianProjectHubTemplateComponent {
  private router = inject(Router);
  protected sidebarExpanded = signal(true);
  protected sections = signal<SidebarSection[]>(STARIAN_PROJECT_HUB_SECTIONS);
  protected footerItems = signal<SidebarItem[]>(STARIAN_PROJECT_HUB_FOOTER_ITEMS);
  protected readonly breadcrumb = inject(BreadcrumbService).breadcrumb;

  protected onNavigate(route: string): void {
    this.router.navigate([route]);
  }
}
