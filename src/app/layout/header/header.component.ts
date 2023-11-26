import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserClaims } from 'src/app/models/user-claims';
import { environment } from 'src/environments/environment';
import { VersionDetailsComponent } from './version-details/version-details.component';

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

  constructor(private matDialog: MatDialog) {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  openVersionDetails() {
    this.matDialog.open(VersionDetailsComponent);
  }

  get userInitials() {
    if (!this.user?.name) {
      return undefined;
    }
    return this.user.name.split(' ').slice(0, 2).map(x => x[0].toUpperCase())
      .join('');
  }
}