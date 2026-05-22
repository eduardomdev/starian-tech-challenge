import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { TokenService } from '@core/tokens/token.service';

export const authenticatedGuard: CanMatchFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  return tokenService.isAuthenticated() || router.createUrlTree(['/login']);
};
