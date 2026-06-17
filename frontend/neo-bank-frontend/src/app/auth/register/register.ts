  import { Component, OnInit, signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
    ValidationErrors
  } from '@angular/forms';
  import { Router, RouterLink } from '@angular/router';
  import { AuthService } from '../../core/services/auth';
  import { StorageService } from '../../core/services/storage';

  @Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrls: ['./register.css']
  })
  export class Register implements OnInit {
    registerForm!: FormGroup;

    // Multi-step flow state
    currentStep = 1;
    loading = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    // Lists and Dropdowns
    branches: any[] = [];
    accountTypes = [
      {
        type: 'SAVINGS',
        title: 'Savings Account',
        minBalance: '₹1,000',
        desc: 'Standard savings account with complete digital access.'
      },
      {
        type: 'CURRENT',
        title: 'Current Account',
        minBalance: '₹5,000',
        desc: 'Premium business-focused account for unlimited transactions.'
      },
      {
        type: 'SALARY',
        title: 'Salary Account',
        minBalance: '₹0',
        desc: 'Zero-balance account tailored for salaried corporate professionals.'
      }
    ];

    // Password Visibility Toggle
    hidePassword = signal(true);
    hideConfirmPassword = signal(true);

    // OTP Sending & Verification State
    emailOtpSent = signal(false);
    mobileOtpSent = signal(false);
    emailVerified = signal(false);
    mobileVerified = signal(false);

    emailOtpLoading = signal(false);
    mobileOtpLoading = signal(false);
    emailVerifyLoading = signal(false);
    mobileVerifyLoading = signal(false);

    // Dev Mode Hints
    devEmailOtp = signal<string | null>(null);
    devMobileOtp = signal<string | null>(null);

    // Countdown Timers
    emailCooldown = signal(0);
    mobileCooldown = signal(0);
    private emailTimerInterval: any;
    private mobileTimerInterval: any;

    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private storageService: StorageService,
      private router: Router
    ) {}

    ngOnInit(): void {
      // Initialize Form
      this.registerForm = this.fb.group(
        {
          accountType: ['', [Validators.required]],
          branchCode: ['', [Validators.required]],
          fullName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]{3,50}$')]],
          aadhaarNumber: ['', [Validators.required, Validators.pattern('^\\d{12}$')]],
          panNumber: [
            '',
            [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]
          ],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
          emailOtpCode: [''],
          mobileOtpCode: [''],
          password: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', [Validators.required]],
          emailOtpReference: ['', [Validators.required]],
          mobileOtpReference: ['', [Validators.required]]
        },
        { validators: this.passwordMatchValidator }
      );

      // Fetch branches from API
      this.loadBranches();
    }

    /* =========================================================
      BRANCHES API CALL
    ========================================================= */
    loadBranches(): void {
      this.authService.getBranches().subscribe({
        next: (data) => {
          this.branches = data;
        },
        error: (err) => {
          console.error('Failed to load branches:', err);
          this.errorMessage.set('Could not fetch branch selection options. Please try again.');
        }
      });
    }

    /* =========================================================
      CUSTOM VALIDATOR FOR PASSWORD MATCH
    ========================================================= */
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (password && confirmPassword && password !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      return null;
    }

    /* =========================================================
      STEP NAVIGATION
    ========================================================= */
    selectAccountType(type: string): void {
      this.registerForm.patchValue({ accountType: type });
    }

    nextStep(): void {
      this.errorMessage.set(null);

      if (this.currentStep === 1) {
        const typeValid = this.registerForm.get('accountType')?.valid;
        const branchValid = this.registerForm.get('branchCode')?.valid;
        if (!typeValid || !branchValid) {
          this.registerForm.get('accountType')?.markAsTouched();
          this.registerForm.get('branchCode')?.markAsTouched();
          this.errorMessage.set('Please select your Account Type and Branch Code.');
          return;
        }
        this.currentStep = 2;
      } else if (this.currentStep === 2) {
        const nameValid = this.registerForm.get('fullName')?.valid;
        const aadhaarValid = this.registerForm.get('aadhaarNumber')?.valid;
        const panValid = this.registerForm.get('panNumber')?.valid;

        if (!nameValid || !aadhaarValid || !panValid) {
          this.registerForm.get('fullName')?.markAsTouched();
          this.registerForm.get('aadhaarNumber')?.markAsTouched();
          this.registerForm.get('panNumber')?.markAsTouched();
          this.errorMessage.set('Please fill out all KYC fields correctly.');
          return;
        }
        this.currentStep = 3;
      } else if (this.currentStep === 3) {
        if (!this.emailVerified() || !this.mobileVerified()) {
          this.errorMessage.set('Both Email and Mobile Number must be verified with OTP to proceed.');
          return;
        }
        this.currentStep = 4;
      }
    }

    prevStep(): void {
      this.errorMessage.set(null);
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    }

    /* =========================================================
      OTP ACTION HANDLERS
    ========================================================= */
    sendEmailOtp(): void {
      const emailControl = this.registerForm.get('email');
      if (!emailControl || emailControl.invalid) {
        emailControl?.markAsTouched();
        this.errorMessage.set('Please enter a valid email address first.');
        return;
      }

      const emailVal = emailControl.value;
      this.errorMessage.set(null);
      this.emailOtpLoading.set(true);

      this.authService.sendOtp(emailVal, 'EMAIL_OTP').subscribe({
        next: (res: any) => {
          this.emailOtpLoading.set(false);
          this.emailOtpSent.set(true);
          this.registerForm.patchValue({ emailOtpReference: emailVal });

          // Show devOtp if returned
          if (res.devOtp) {
            this.devEmailOtp.set(res.devOtp);
            this.registerForm.patchValue({ emailOtpCode: res.devOtp });
          }

          this.startEmailTimer();
          this.successMessage.set('Verification OTP sent to your email.');
          setTimeout(() => this.successMessage.set(null), 5000);
        },
        error: (err: any) => {
          this.emailOtpLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to send Email OTP. Try again.');
        }
      });
    }

    verifyEmailOtp(): void {
      const code = this.registerForm.get('emailOtpCode')?.value;
      const ref = this.registerForm.get('emailOtpReference')?.value;

      if (!code) {
        this.errorMessage.set('Please enter the email OTP code.');
        return;
      }

      this.errorMessage.set(null);
      this.emailVerifyLoading.set(true);

      this.authService.verifyOtp(ref, 'EMAIL_OTP', code).subscribe({
        next: () => {
          this.emailVerifyLoading.set(false);
          this.emailVerified.set(true);
          this.devEmailOtp.set(null);
          this.successMessage.set('Email address successfully verified!');
          setTimeout(() => this.successMessage.set(null), 5000);
        },
        error: (err: any) => {
          this.emailVerifyLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Invalid Email OTP. Please check and try again.');
        }
      });
    }

    sendMobileOtp(): void {
      const phoneControl = this.registerForm.get('phone');
      if (!phoneControl || phoneControl.invalid) {
        phoneControl?.markAsTouched();
        this.errorMessage.set('Please enter a valid 10-digit mobile number.');
        return;
      }

      const phoneVal = phoneControl.value;
      this.errorMessage.set(null);
      this.mobileOtpLoading.set(true);

      this.authService.sendOtp(phoneVal, 'MOBILE_OTP').subscribe({
        next: (res: any) => {
          this.mobileOtpLoading.set(false);
          this.mobileOtpSent.set(true);
          this.registerForm.patchValue({ mobileOtpReference: phoneVal });

          // Show devOtp if returned
          if (res.devOtp) {
            this.devMobileOtp.set(res.devOtp);
            this.registerForm.patchValue({ mobileOtpCode: res.devOtp });
          }

          this.startMobileTimer();
          this.successMessage.set('Verification OTP sent to your mobile phone.');
          setTimeout(() => this.successMessage.set(null), 5000);
        },
        error: (err: any) => {
          this.mobileOtpLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to send SMS OTP. Try again.');
        }
      });
    }

    verifyMobileOtp(): void {
      const code = this.registerForm.get('mobileOtpCode')?.value;
      const ref = this.registerForm.get('mobileOtpReference')?.value;

      if (!code) {
        this.errorMessage.set('Please enter the mobile OTP code.');
        return;
      }

      this.errorMessage.set(null);
      this.mobileVerifyLoading.set(true);

      this.authService.verifyOtp(ref, 'MOBILE_OTP', code).subscribe({
        next: () => {
          this.mobileVerifyLoading.set(false);
          this.mobileVerified.set(true);
          this.devMobileOtp.set(null);
          this.successMessage.set('Mobile phone successfully verified!');
          setTimeout(() => this.successMessage.set(null), 5000);
        },
        error: (err: any) => {
          this.mobileVerifyLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Invalid Mobile OTP. Please check and try again.');
        }
      });
    }

    /* =========================================================
      TIMERS HELPERS
    ========================================================= */
    private startEmailTimer(): void {
      this.emailCooldown.set(60);
      if (this.emailTimerInterval) clearInterval(this.emailTimerInterval);
      this.emailTimerInterval = setInterval(() => {
        this.emailCooldown.update((val) => {
          if (val <= 1) {
            clearInterval(this.emailTimerInterval);
            return 0;
          }
          return val - 1;
        });
      }, 1000);
    }

    private startMobileTimer(): void {
      this.mobileCooldown.set(60);
      if (this.mobileTimerInterval) clearInterval(this.mobileTimerInterval);
      this.mobileTimerInterval = setInterval(() => {
        this.mobileCooldown.update((val) => {
          if (val <= 1) {
            clearInterval(this.mobileTimerInterval);
            return 0;
          }
          return val - 1;
        });
      }, 1000);
    }

    /* =========================================================
      PASSWORD VISIBILITY TOGGLE
    ========================================================= */
    togglePassword(): void {
      this.hidePassword.update((val) => !val);
    }

    toggleConfirmPassword(): void {
      this.hideConfirmPassword.update((val) => !val);
    }

    /* =========================================================
      FINAL FORM SUBMISSION
    ========================================================= */
    onSubmit(): void {
      this.errorMessage.set(null);

      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        this.errorMessage.set('Please fill out all fields correctly before submitting.');
        return;
      }

      if (!this.emailVerified() || !this.mobileVerified()) {
        this.errorMessage.set('Please make sure to verify both email and mobile numbers.');
        return;
      }

      this.loading.set(true);

      const payload = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
        branchCode: this.registerForm.value.branchCode,
        accountType: this.registerForm.value.accountType,
        aadhaarNumber: this.registerForm.value.aadhaarNumber,
        panNumber: this.registerForm.value.panNumber,
        emailOtpReference: this.registerForm.value.emailOtpReference,
        mobileOtpReference: this.registerForm.value.mobileOtpReference
      };

      this.authService.register(payload).subscribe({
        next: (response: any) => {
          this.loading.set(false);
          this.successMessage.set('Account created successfully! Redirecting...');

          // Save token and user details to storage
          this.storageService.saveToken(response.accessToken);
          this.storageService.saveUser(response);

          // Redirect to dashboard
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (err: any) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.error?.message || 'Registration failed. Please review fields and try again.'
          );
        }
      });
    }

    /* =========================================================
      FORM CONTROL GETTERS FOR ERROR DISPLAY
    ========================================================= */
    get f() {
      return this.registerForm.controls;
    }
  }

