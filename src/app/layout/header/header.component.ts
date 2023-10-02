import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UserClaims } from 'src/app/models/user-claims';

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

  constructor() {

  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
