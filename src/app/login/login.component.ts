import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private returnTo = '/';
  loginProviders = ['google', 'facebook', 'microsoft'];

  constructor(private actRoute: ActivatedRoute, private oidcSecurityService: OidcSecurityService) {

  }

  ngOnInit(): void {
    this.actRoute.queryParams.pipe(take(1)).subscribe(qp => {
      if (qp['returnTo']) {
        this.returnTo = qp['returnTo'];
      }
    });
  }

  ngOnDestroy(): void {

  }

  login(provider: string) {
    localStorage.setItem('post_login_redirect', this.returnTo);
    this.oidcSecurityService.authorize(undefined, {
      customParams: {
        provider: provider
      },
      urlHandler: url => {
        const newUrl = url.replace('/auth?', '/auth/' + provider + '?');
        location.href = newUrl;
      }
    });
  }
}
