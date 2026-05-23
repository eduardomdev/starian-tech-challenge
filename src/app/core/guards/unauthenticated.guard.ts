import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { TokenService } from '@core/tokens/token.service';
import { APP_ROUTES } from '@core/constants/app-routes.constant';

export const unauthenticatedGuard: CanMatchFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return !tokenService.isAuthenticated() || router.createUrlTree([APP_ROUTES.hub]);
};
