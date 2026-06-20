import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LoanProducts } from './loan-products';
import { LoanService } from '../../core/services/loan';

describe('LoanProducts', () => {
  let component: LoanProducts;
  let fixture: ComponentFixture<LoanProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanProducts],
      providers: [
        {
          provide: LoanService,
          useValue: {
            getLoanProducts: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
