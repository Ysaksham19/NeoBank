import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  isLoading = signal(false);
  loginSuccess = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRememberedEmail();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  loadRememberedEmail(): void {
    const saved = this.authService.getRememberEmail();

    if (saved) {
      this.loginForm.patchValue({
        email: saved,
        remember: true
      });
    }
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {

        if (res.accessToken) {
          this.authService.saveToken(res.accessToken);
          console.log('TOKEN:', res.accessToken);
          console.log('Stored:', localStorage.getItem('token'));
        }

        if (this.loginForm.value.remember) {
          this.authService.saveRememberEmail(payload.email);
        }

        this.loginSuccess.set(true);
          this.isLoading.set(false);

          setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
      },

      error: (err) => {
        this.isLoading.set(false);

        this.errorMessage.set(
          err?.error?.message ||
          'Invalid email or password'
        );
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}