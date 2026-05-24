import { Routes } from '@angular/router';
import { StarianProjectHubLayoutComponent } from './features/starian-project-hub/layout/starian-project-hub-layout';
import { authenticatedGuard } from '@core/guards/authenticated.guard';
import { unauthenticatedGuard } from '@core/guards/unauthenticated.guard';

export const routes: Routes = [
  {
    path: 'login',
    canMatch: [unauthenticatedGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(
        m => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canMatch: [unauthenticatedGuard],
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        m => m.RegisterComponent
      ),
  },
  {
    path: 'starian-hub',
    canMatch: [authenticatedGuard],
    component: StarianProjectHubLayoutComponent,
    children: [
      {
        path: 'dashboard',
        data: { breadcrumb: [{ name: 'Starian Hub' }, { name: 'Dashboard' }] },
        loadComponent: () =>
          import('./features/starian-project-hub/pages/dashboard/dashboard').then(
            m => m.DashboardPageComponent
          ),
      },
      {
        path: 'products',
        data: { breadcrumb: [{ name: 'Starian Hub' }, { name: 'Produtos' }] },
        loadComponent: () =>
          import('./features/starian-project-hub/pages/products/products').then(
            m => m.ProductsPageComponent
          ),
      },
      {
        path: 'users',
        data: { breadcrumb: [{ name: 'Starian Hub' }, { name: 'Usuários' }] },
        loadComponent: () =>
          import('./features/starian-project-hub/pages/users/users').then(
            m => m.UsersPageComponent
          ),
      },
      {
        path: 'profile',
        data: { breadcrumb: [{ name: 'Starian Hub' }, { name: 'Perfil' }] },
        loadComponent: () =>
          import('./features/starian-project-hub/pages/profile/profile').then(
            m => m.ProfilePageComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];
