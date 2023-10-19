import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const oidcSecurityService = inject(OidcSecurityService);
  return oidcSecurityService.isAuthenticated$.pipe(
    tap(ar => {
      console.log(ar);
      if (!ar.isAuthenticated) {
        router.navigateByUrl('/login?returnTo=' + encodeURIComponent(state.url))
      }
    }),
    map(x => x.isAuthenticated)
  );
};
