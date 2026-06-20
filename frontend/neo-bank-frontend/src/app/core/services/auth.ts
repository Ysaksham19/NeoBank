// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { Router } from '@angular/router';
// import { StorageService } from './storage';
// import { environment } from '../../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private readonly BASE_URL = `${environment.apiUrl}/auth`;

//   private http           = inject(HttpClient);
//   private router         = inject(Router);
//   private storageService = inject(StorageService);

//   login(payload: any): Observable<any> {
//     return this.http.post(`${this.BASE_URL}/login`, payload).pipe(
//       tap((response: any) => {
//         this.storageService.saveToken(response.accessToken);
//         this.storageService.saveUser(response);
//       })
//     );
//   }

//   register(payload: any): Observable<any> {
//     return this.http.post(`${this.BASE_URL}/register`, payload);
//   }

//   getBranches(): Observable<any> {
//     return this.http.get(`${environment.apiUrl}/branches`);
//   }

//   sendOtp(reference: string, otpType: string): Observable<any> {
//     return this.http.post(`${environment.apiUrl}/otp/send`, { reference, otpType });
//   }

//   verifyOtp(reference: string, otpType: string, otpCode: string): Observable<any> {
//     return this.http.post(`${environment.apiUrl}/otp/verify`, { reference, otpType, otpCode });
//   }

//   getCurrentUser(): any {
//     return this.storageService.getUser();
//   }

//   isLoggedIn(): boolean {
//     return this.storageService.isLoggedIn();
//   }

//   // FIX #9 — call backend logout to blacklist the JWT
//   logout(): void {
//     this.http.post(`${this.BASE_URL}/logout`, {}).subscribe({
//       complete: () => this._clearAndRedirect(),
//       error:    () => this._clearAndRedirect()
//     });
//   }

//   private _clearAndRedirect(): void {
//     this.storageService.clear();
//     this.router.navigate(['/login']);
//   }
// }


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

  login(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, payload).pipe(
      tap((response: any) => {
        this.storageService.saveToken(response.accessToken);
        this.storageService.saveUser(response);
      })
    );
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, payload);
  }

  getBranches(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/branches`);
  }

  sendOtp(reference: string, otpType: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/otp/send`, { reference, otpType });
  }

  verifyOtp(reference: string, otpType: string, otpCode: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/otp/verify`, { reference, otpType, otpCode });
  }

  getCurrentUser(): any {
    return this.storageService.getUser();
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  // Manual logout → green toast on login page
  logout(): void {
    this.http.post(`${this.BASE_URL}/logout`, {}).subscribe({
      complete: () => this._clearAndRedirect(true),
      error:    () => this._clearAndRedirect(true)
    });
  }

  // Auto-expiry logout → amber expired banner on login page
  private _clearAndRedirectExpired(): void {
    this.storageService.clear();
    this.router.navigate(['/login'], { queryParams: { expired: 'true' } });
  }

  // ← loggedOut flag controls which notification shows
  private _clearAndRedirect(showLogoutToast = false): void {
    this.storageService.clear();
    if (showLogoutToast) {
      this.router.navigate(['/login'], { queryParams: { loggedOut: 'true' } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  scheduleAutoLogout(): void {
    const token = this.storageService.getToken();
    if (!token) return;
    try {
      const payload   = JSON.parse(atob(token.split('.')[1]));
      const expiresIn = payload.exp * 1000 - Date.now();
      if (expiresIn <= 0) { this._clearAndRedirectExpired(); return; }
      setTimeout(() => this._clearAndRedirectExpired(), expiresIn);
    } catch {
      this._clearAndRedirectExpired();
    }
  }
}