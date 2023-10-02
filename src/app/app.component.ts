import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';
import { UserClaims } from './models/user-claims';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  user: UserClaims | undefined;
  private _subs: Subscription[] = [];

  constructor(private translateService: TranslateService, private oidcSecurityService: OidcSecurityService) {

  }

  ngOnInit(): void {
    this._subs.push(this.oidcSecurityService.checkAuth().subscribe(() => {
      this._subs.push(this.oidcSecurityService.getUserData().subscribe(u => {
        this.user = u;
      }));
    }));

    this.translateService.setDefaultLang('en');
  }

  ngOnDestroy(): void {
    this._subs.forEach(s => s.unsubscribe());
  }

  onLogoutClicked() {
    this.oidcSecurityService.logoff().subscribe(() => {

    });
  }
}
