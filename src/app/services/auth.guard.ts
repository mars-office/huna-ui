import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const oidcSecurityService = inject(OidcSecurityService);
  return oidcSecurityService.isAuthenticated().pipe(
    tap(isAuth => {
      if (!isAuth) {
        router.navigateByUrl('/login?returnTo=' + encodeURIComponent(state.url))
      }
    })
  );
};
