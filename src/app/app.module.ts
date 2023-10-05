import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClient,
} from '@angular/common/http';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SettingsComponent } from './settings/settings.component';
import { AbstractSecurityStorage, AuthInterceptor, AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { OidcLocalStorage } from './services/oidc-local-storage';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    HomeComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AuthModule.forRoot({
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
    }),
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: AbstractSecurityStorage, useClass: OidcLocalStorage }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
