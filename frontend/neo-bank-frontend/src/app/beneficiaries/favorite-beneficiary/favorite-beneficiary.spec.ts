import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBeneficiary } from './favorite-beneficiary';

describe('FavoriteBeneficiary', () => {
  let component: FavoriteBeneficiary;
  let fixture: ComponentFixture<FavoriteBeneficiary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteBeneficiary],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteBeneficiary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
