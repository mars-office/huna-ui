import { NgModule } from '@angular/core';
import { AbstractSecurityStorage, AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';
import { OidcLocalStorage } from './services/oidc-local-storage';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
              authority: window.location.protocol + '//dex.' + window.location.hostname,
              redirectUrl: window.location.origin + '/',
              postLogoutRedirectUri: window.location.origin + '/',
              clientId: 'ui',
              scope: 'openid offline_access profile email',
              responseType: 'code',
              silentRenew: true,
              useRefreshToken: true,
              renewTimeBeforeTokenExpiresInSeconds: 30,
              logLevel: environment.production ? LogLevel.Warn : LogLevel.Debug,
              secureRoutes: ['/api'],
          }
      })],
    exports: [AuthModule],
    providers: [{ provide: AbstractSecurityStorage, useClass: OidcLocalStorage }],
})
export class AuthConfigModule {}
