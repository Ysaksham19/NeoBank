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

  // FIX #9 — call backend logout to blacklist the JWT
  logout(): void {
    this.http.post(`${this.BASE_URL}/logout`, {}).subscribe({
      complete: () => this._clearAndRedirect(),
      error:    () => this._clearAndRedirect()
    });
  }

  private _clearAndRedirect(): void {
    this.storageService.clear();
    this.router.navigate(['/login']);
  }
}
