import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBeneficiary } from './edit-beneficiary';

describe('EditBeneficiary', () => {
  let component: EditBeneficiary;
  let fixture: ComponentFixture<EditBeneficiary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBeneficiary],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBeneficiary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
