import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserClaims } from 'src/app/models/user-claims';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input()
  user: UserClaims | undefined;

  @Output()
  logoutClicked = new EventEmitter<void>();

  languages = environment.languages;

  @Input()
  currentLanguage: string | undefined;

  @Output()
  languageSelected = new EventEmitter<string>();

  @Output()
  loginClicked = new EventEmitter<void>();


  appVersion = environment.version;
  appEnv = environment.env;

  constructor() {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
