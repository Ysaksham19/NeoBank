import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteBeneficiary } from './delete-beneficiary';

describe('DeleteBeneficiary', () => {
  let component: DeleteBeneficiary;
  let fixture: ComponentFixture<DeleteBeneficiary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteBeneficiary],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBeneficiary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
