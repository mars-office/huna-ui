import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionDetailsComponent } from './version-details.component';

describe('VersionDetailsComponent', () => {
  let component: VersionDetailsComponent;
  let fixture: ComponentFixture<VersionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VersionDetailsComponent]
    });
    fixture = TestBed.createComponent(VersionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
