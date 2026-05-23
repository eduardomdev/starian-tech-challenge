import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StrSidebarComponent } from '../../../shared/components/atoms/sidebar/sidebar.component';
import { SidebarSection, SidebarItem } from '../../../shared/components/atoms/sidebar/sidebar.models';
import { STARIAN_PROJECT_HUB_SECTIONS, STARIAN_PROJECT_HUB_FOOTER_ITEMS } from '../../../core/constants/starian-project-hub.constants';
import { StrBreadcrumbComponent } from '../../../shared/components/atoms/breadcrumb/breadcrumb';
import { StrAvatarComponent } from '../../../shared/components/atoms/avatar/avatar';
import { BreadcrumbService } from '../../../shared/components/atoms/breadcrumb/breadcrumb.service';
import { UserService } from '@shared/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { APP_ROUTES } from '@core/constants/app-routes.constant';
import { getFullName } from '@shared/utils/user.utils';

@Component({
  selector: 'app-starian-project-hub-layout',
  imports: [RouterOutlet, StrSidebarComponent, StrBreadcrumbComponent, StrAvatarComponent],
  templateUrl: './starian-project-hub-layout.html',
  styleUrl: './starian-project-hub-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarianProjectHubLayoutComponent {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  protected readonly sidebarExpanded = signal(true);
  protected readonly sections = signal<SidebarSection[]>(STARIAN_PROJECT_HUB_SECTIONS);
  protected readonly footerItems = signal<SidebarItem[]>(STARIAN_PROJECT_HUB_FOOTER_ITEMS);
  protected readonly breadcrumb = inject(BreadcrumbService).breadcrumb;

  protected readonly userName = computed(() => {
    const user = this.userService.currentUser.value();
    return user ? getFullName(user.name) : 'Usuário';
  });

  protected onNavigate(route: string): void {
    if (route === APP_ROUTES.login) {
      this.authService.logout();
      return;
    }
    this.router.navigate([route]);
  }

  protected navigateToProfile(): void {
    this.router.navigate([APP_ROUTES.profile]);
  }
}
