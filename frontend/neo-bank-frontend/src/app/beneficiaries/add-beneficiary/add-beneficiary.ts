import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder, FormGroup, Validators,
  ReactiveFormsModule, AbstractControl, ValidationErrors
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { BeneficiaryService } from '../../core/services/beneficiary';
import { BeneficiaryType } from '../../models/beneficiary.model';

// IFSC: 4 letters + '0' + 6 alphanumeric
function ifscValidator(ctrl: AbstractControl): ValidationErrors | null {
  const val: string = ctrl.value ?? '';
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val.toUpperCase()) ? null : { invalidIfsc: true };
}

@Component({
  selector: 'app-add-beneficiary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-beneficiary.html',
  styleUrls: ['./add-beneficiary.css']
})
export class AddBeneficiary {

  form: FormGroup;
  submitting   = false;
  errorMessage = '';
  successMsg   = '';

  // Step wizard: 1 = details, 2 = review & confirm
  step = 1;

  readonly beneficiaryTypes: { value: BeneficiaryType; label: string; desc: string }[] = [
    { value: 'INTERNAL', label: 'Same Bank (NeoBank)',  desc: 'Instant transfer — no IFSC required' },
    { value: 'EXTERNAL', label: 'Other Bank',           desc: 'NEFT / RTGS / IMPS — IFSC required'  }
  ];

  readonly dailyLimitOptions = [10000, 25000, 50000, 100000, 200000];

  constructor(
    private fb:     FormBuilder,
    private svc:    BeneficiaryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nickname:        ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      beneficiaryType: ['INTERNAL', Validators.required],
      accountNumber:   ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
      confirmAccount:  ['', Validators.required],
      bankName:        ['NeoBank', Validators.required],
      ifscCode:        ['', []],
      dailyLimit:      [50000, [Validators.required, Validators.min(1000), Validators.max(500000)]]
    }, { validators: this.accountMatchValidator });

    // Dynamically adjust validators when type changes
    this.form.get('beneficiaryType')!.valueChanges.subscribe((type: BeneficiaryType) => {
      const ifsc = this.form.get('ifscCode')!;
      const bank = this.form.get('bankName')!;
      if (type === 'EXTERNAL') {
        ifsc.setValidators([Validators.required, ifscValidator]);
        bank.setValidators([Validators.required]);
        bank.setValue('');
      } else {
        ifsc.clearValidators();
        ifsc.setValue('');
        bank.setValue('NeoBank');
      }
      ifsc.updateValueAndValidity();
      bank.updateValueAndValidity();
    });
  }

  private accountMatchValidator(group: AbstractControl): ValidationErrors | null {
    const acct    = group.get('accountNumber')?.value;
    const confirm = group.get('confirmAccount')?.value;
    return acct && confirm && acct !== confirm ? { accountMismatch: true } : null;
  }

  get isExternal(): boolean { return this.form.get('beneficiaryType')?.value === 'EXTERNAL'; }
  get f() { return this.form.controls; }

  onIfscInput(): void {
    const ctrl = this.form.get('ifscCode')!;
    ctrl.setValue(ctrl.value.toUpperCase(), { emitEvent: false });
  }

  goToReview(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.step = 2;
  }

  goBack(): void { this.step = 1; }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting   = true;
    this.errorMessage = '';

    const { confirmAccount, ...payload } = this.form.value;

    this.svc.add(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = 'Beneficiary added successfully!';
        setTimeout(() => this.router.navigate(['/beneficiaries']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting   = false;
        this.errorMessage = err?.error?.message ?? 'Failed to add beneficiary. Please try again.';
        this.step = 1;
      }
    });
  }
}