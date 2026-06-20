import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepaymentScheduleComponent } from './repayment-schedule';

describe('RepaymentSchedule', () => {
  let component: RepaymentScheduleComponent;
  let fixture: ComponentFixture<RepaymentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepaymentScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepaymentScheduleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
