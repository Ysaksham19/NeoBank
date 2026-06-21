import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly BASE_URL = `${environment.apiUrl}/auth`;

  private http           = inject(HttpClient);
  private router         = inject(Router);
  private storageService = inject(StorageService);

  private tokenExpiryTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Constructor: restore session on every app start / refresh ────
  constructor() {
    this.restoreSession();
  }

  // ── Restore session on page refresh ──────────────────────────────
  private restoreSession(): void {
    const token = this.storageService.getToken();
    if (!token) return;

    if (this.storageService.isTokenExpired(token)) {
      // Token already expired — clear and stay on login
      this.storageService.clear();
      return;
    }

    // Token is valid — reschedule the auto-logout timer
    this.scheduleAutoLogout();
  }

  // ── Login ─────────────────────────────────────────────────────────
  login(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, payload).pipe(
      tap((response: any) => {
        this.storageService.saveToken(response.accessToken);
        this.storageService.saveUser(response);
        this.scheduleAutoLogout();    // start expiry countdown
      })
    );
  }

  // ── Register ──────────────────────────────────────────────────────
  register(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, payload);
  }

  // ── Branches ──────────────────────────────────────────────────────
  getBranches(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/branches`);
  }

  // ── OTP ───────────────────────────────────────────────────────────
  sendOtp(reference: string, otpType: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/otp/send`, { reference, otpType });
  }

  verifyOtp(reference: string, otpType: string, otpCode: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/otp/verify`, { reference, otpType, otpCode });
  }

  // ── User Helpers ──────────────────────────────────────────────────
  getCurrentUser(): any {
    return this.storageService.getUser();
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  // ── Manual Logout (button click) ──────────────────────────────────
  logout(): void {
    this.http.post(`${this.BASE_URL}/logout`, {}).subscribe({
      complete: () => this._clearAndRedirect(true),
      error:    () => this._clearAndRedirect(true)
    });
  }

  // ── Auto Logout Timer ─────────────────────────────────────────────
  scheduleAutoLogout(): void {
    // Clear any existing timer before setting a new one
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
      this.tokenExpiryTimer = null;
    }

    const token = this.storageService.getToken();
    if (!token) return;

    const expiresIn = this.storageService.getTokenExpiryMs(token);

    if (expiresIn <= 0) {
      this._clearAndRedirectExpired();
      return;
    }

    this.tokenExpiryTimer = setTimeout(() => {
      this._clearAndRedirectExpired();
    }, expiresIn);
  }

  // ── Private Helpers ───────────────────────────────────────────────

  // Called when token expires → amber "session expired" banner
  private _clearAndRedirectExpired(): void {
    this._clearTimer();
    this.storageService.clear();
    this.router.navigate(['/login'], { queryParams: { expired: 'true' } });
  }

  // Called on manual logout → green "logged out" toast
  private _clearAndRedirect(showLogoutToast = false): void {
    this._clearTimer();
    this.storageService.clear();
    if (showLogoutToast) {
      this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private _clearTimer(): void {
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
      this.tokenExpiryTimer = null;
    }
  }
}