import { Component } from '@angular/core';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(private testService: TestService) {

  }

  test() {
    this.testService.test().subscribe(r => {
      alert(r);
    });
  }

}
