import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { UserClaims } from './models/user-claims';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  user: UserClaims | undefined;
  private _subs: Subscription[] = [];
  currentLanguage = environment.languages.find((x) => x.default)!.code;

  constructor(
    private translateService: TranslateService,
    private oidcSecurityService: OidcSecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initAuth();

    this.initLanguage();
  }

  private initAuth() {
    this._subs.push(
      this.oidcSecurityService.checkAuth().subscribe(authResponse => {
        if (authResponse.isAuthenticated) {
          const postLoginRedirect = localStorage.getItem('post_login_redirect');
          if (postLoginRedirect) {
            localStorage.removeItem('post_login_redirect');
            this.router.navigateByUrl(postLoginRedirect);
            return;
          }
        }
      })
    );
    this._subs.push(
      this.oidcSecurityService.userData$.subscribe((u) => {
        this.user = u.userData;
      })
    );
  }

  private initLanguage() {
    this.translateService.addLangs(environment.languages.map((x) => x.code));
    this.translateService.setDefaultLang(
      environment.languages.find((x) => x.default)!.code
    );
    let lang = environment.languages.find((x) => x.default)!.code;
    const lsLang = localStorage.getItem('lang');
    if (lsLang) {
      lang = lsLang;
    } else {
      const browserLang = this.translateService.getBrowserLang();
      if (browserLang) {
        lang = browserLang;
      }
    }
    this.translateService.use(lang).subscribe();

    this._subs.push(
      this.translateService.onLangChange.subscribe((lce) => {
        this.currentLanguage = lce.lang;
      })
    );
  }

  ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  onLogoutClicked() {
    this.oidcSecurityService.logoffLocal();
    this.router.navigateByUrl('/');
  }

  onLoginClicked() {
    this.router.navigateByUrl('/login?returnTo=' + encodeURIComponent(this.router.url));
  }

  changeLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translateService.use(lang).subscribe();
  }
}
