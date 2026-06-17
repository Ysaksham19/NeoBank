import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  loginForm: FormGroup;

  hidePassword = signal(true);

  loading = signal(false);

  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ]

    });

  }

  /* ==========================================
     TOGGLE PASSWORD
  ========================================== */

  togglePassword(): void {

    this.hidePassword.update(
      value => !value
    );

  }

  /* ==========================================
     LOGIN
  ========================================== */

  onSubmit(): void {

    this.errorMessage.set('');

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading.set(true);

    this.authService
    .login(this.loginForm.value)
    .subscribe({

      next: (response) => {

        this.loading.set(false);

        console.log('Login success:', response);

        const role = response.role;

        console.log('ROLE =', role);

        if (role === 'ADMIN' || role === 'ROLE_ADMIN') {

          this.router.navigate(['/admin-dashboard']);

        } else {

          this.router.navigate(['/dashboard']);

        }

      },

      error: (error) => {

        this.loading.set(false);

        console.error(error);

        this.errorMessage.set(
          error?.error?.message ||
          'Invalid email or password.'
        );

      }

    });
        
  }

  /* ==========================================
     GETTERS
  ========================================== */

  get email() {

    return this.loginForm.get('email');

  }

  get password() {

    return this.loginForm.get('password');

  }

}