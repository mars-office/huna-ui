import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';


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
              secureRoutes: [window.location.origin + '/api'],
          }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
