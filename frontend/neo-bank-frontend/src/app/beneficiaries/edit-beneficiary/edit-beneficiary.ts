import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { BeneficiaryService } from '../../core/services/beneficiary';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-edit-beneficiary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-beneficiary.html',
  styleUrls: ['./edit-beneficiary.css']
})
export class EditBeneficiary implements OnInit {

  form: FormGroup;
  beneficiary: Beneficiary | null = null;

  loading      = true;
  submitting   = false;
  errorMessage = '';
  successMsg   = '';

  readonly dailyLimitOptions = [10000, 25000, 50000, 100000, 200000];

  constructor(
    private fb:     FormBuilder,
    private route:  ActivatedRoute,
    private svc:    BeneficiaryService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nickname:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dailyLimit: [50000, [Validators.required, Validators.min(1000), Validators.max(500000)]]
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getById(id).subscribe({
      next: (b) => {
        this.beneficiary = b;
        this.form.patchValue({ nickname: b.nickname, dailyLimit: b.dailyLimit });
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err?.error?.message ?? 'Beneficiary not found.';
        this.loading = false;
      }
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting   = true;
    this.errorMessage = '';

    this.svc.edit(this.beneficiary!.id, this.form.value).subscribe({
      next: () => {
        this.submitting = false;
        this.successMsg = 'Beneficiary updated successfully!';
        setTimeout(() => this.router.navigate(['/beneficiaries']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting   = false;
        this.errorMessage = err?.error?.message ?? 'Update failed. Please try again.';
      }
    });
  }
}