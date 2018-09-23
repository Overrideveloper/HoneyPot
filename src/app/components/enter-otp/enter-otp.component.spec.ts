import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterOtpComponent } from './enter-otp.component';

describe('EnterOtpComponent', () => {
  let component: EnterOtpComponent;
  let fixture: ComponentFixture<EnterOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
