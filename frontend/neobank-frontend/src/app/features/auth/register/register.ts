// src/app/features/auth/register/register.ts

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {

  step = signal(1);
  loading = signal(false);
  success = signal(false);
  errorMessage = signal('');

  emailVerified = signal(false);
  mobileVerified = signal(false);

  accountTypes = [
    { label: 'Savings Account', value: 'SAVINGS' },
    { label: 'Current Account', value: 'CURRENT' },
    { label: 'Salary Account', value: 'SALARY' }
  ];

  branches: any[] = [];
  successData: any = {};

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadBranches();
  }

  initForm() {
    this.form = this.fb.group(
      {
        accountType: ['', Validators.required],
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        dob: ['', Validators.required],

        emailOtp: [''],
        mobileOtp: [''],

        aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
        branchCode: ['', Validators.required],

        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],

        terms: [false, Validators.requiredTrue]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const p = group.get('password')?.value;
    const c = group.get('confirmPassword')?.value;
    return p === c ? null : { passwordMismatch: true };
  }

  loadBranches() {
    this.authService.getBranches().subscribe({
      next: (res) => this.branches = res,
      error: () => this.errorMessage.set('Failed to load branches')
    });
  }

  selectAccount(type: string) {
    this.loading.set(true);

    this.authService.selectAccountType(type).subscribe({
      next: () => {
        this.form.patchValue({ accountType: type });
        this.step.set(2);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to select account type');
        this.loading.set(false);
      }
    });
  }

  nextStep() {
    this.step.update(v => v + 1);
  }

  prevStep() {
    this.step.update(v => v - 1);
  }

  sendEmailOtp() {
    this.authService.sendOtp(
      this.form.value.email,
      'EMAIL_OTP'
    ).subscribe({
      next: () => alert('Email OTP Sent'),
      error: (err) => this.errorMessage.set(err.error.message)
    });
  }

  verifyEmailOtp() {
    this.authService.verifyOtp(
      this.form.value.email,
      'EMAIL_OTP',
      this.form.value.emailOtp
    ).subscribe({
      next: () => this.emailVerified.set(true),
      error: (err) => this.errorMessage.set(err.error.message)
    });
  }

  sendMobileOtp() {
    this.authService.sendOtp(
      this.form.value.phone,
      'MOBILE_OTP'
    ).subscribe({
      next: () => alert('Mobile OTP Sent'),
      error: (err) => this.errorMessage.set(err.error.message)
    });
  }

  verifyMobileOtp() {
    this.authService.verifyOtp(
      this.form.value.phone,
      'MOBILE_OTP',
      this.form.value.mobileOtp
    ).subscribe({
      next: () => this.mobileVerified.set(true),
      error: (err) => this.errorMessage.set(err.error.message)
    });
  }

  submit() {
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Please fill all required fields correctly.');
      return;
    }

    if (!this.emailVerified()) {
      this.errorMessage.set('Please verify Email OTP first.');
      return;
    }

    if (!this.mobileVerified()) {
      this.errorMessage.set('Please verify Mobile OTP first.');
      return;
    }

    this.loading.set(true);

    const payload = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      branchCode: this.form.value.branchCode,
      accountType: this.form.value.accountType,
      aadhaarNumber: this.form.value.aadhaarNumber,
      panNumber: this.form.value.panNumber,
      emailOtpReference: this.form.value.email,
      mobileOtpReference: this.form.value.phone
    };

    this.authService.register(payload).subscribe({
      next: (res: any) => {
        this.successData = res;

        if (res.accessToken) {
          localStorage.setItem('token', res.accessToken);
        }

        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err?.error?.message || 'Registration failed.'
        );
      }
    });
  }


  sendAadhaarOtp() {
    this.authService.sendOtp(
      this.form.value.aadhaarNumber,
      'AADHAAR_OTP'
    ).subscribe({
      next: () => alert('Aadhaar OTP Sent'),
      error: (err) => this.errorMessage.set(err.error.message)
    });
  }

  
  goToLogin() {
    this.router.navigate(['/login']);
  }

  get f() {
    return this.form.controls;
  }
}