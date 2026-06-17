import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanProducts } from './loan-products';

describe('LoanProducts', () => {
  let component: LoanProducts;
  let fixture: ComponentFixture<LoanProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
