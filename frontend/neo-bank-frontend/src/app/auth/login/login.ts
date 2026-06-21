import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit, OnDestroy {
  loginForm      : FormGroup;
  hidePassword    = signal(true);
  loading         = signal(false);
  errorMessage    = signal('');
  sessionExpired  = signal(false);   // amber banner — token expired
  logoutSuccess   = signal(false);   // green toast  — manual logout

  private _toastTimer: any;

  constructor(
    private fb          : FormBuilder,
    private router      : Router,
    private route       : ActivatedRoute,
    private authService : AuthService
  ) {
    this.loginForm = this.fb.group({
      email   : ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      // Session expired → amber banner (stays until dismissed or new login attempt)
      if (params['expired'] === 'true') {
        this.sessionExpired.set(true);
        this._cleanUrl();
      }

      // Manual logout → green toast (auto-dismisses after 4s)
      if (params['loggedOut'] === 'true') {
        this.logoutSuccess.set(true);
        this._cleanUrl();
        this._toastTimer = setTimeout(() => this.logoutSuccess.set(false), 4000);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this._toastTimer);
  }

  /** Remove query params from URL bar without re-navigating */
  private _cleanUrl(): void {
    this.router.navigate([], {
      relativeTo : this.route,
      queryParams: {},
      replaceUrl : true
    });
  }

  togglePassword(): void {
    this.hidePassword.update(v => !v);
  }

  dismissExpired(): void { this.sessionExpired.set(false); }
  dismissLogout():  void { this.logoutSuccess.set(false); clearTimeout(this._toastTimer); }

  onSubmit(): void {
    this.errorMessage.set('');
    this.sessionExpired.set(false);   // clear banners on new login attempt
    this.logoutSuccess.set(false);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        const user    = this.authService.getCurrentUser();
        const isAdmin =
          user?.role === 'ADMIN' ||
          user?.role === 'ROLE_ADMIN' ||
          user?.roles?.includes('ADMIN') ||
          user?.roles?.includes('ROLE_ADMIN') ||
          user?.isAdmin === true;
        this.router.navigate([isAdmin ? '/admin' : '/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error?.error?.message || 'Invalid email or password.');
      }
    });
  }

  get email()    { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}