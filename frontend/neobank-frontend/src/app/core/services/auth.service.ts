// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  /* ===============================
     REGISTER FLOW
  =============================== */

  getBranches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/branches`);
  }

  selectAccountType(accountType: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/account-type`, {
      accountType
    });
  }

  sendOtp(reference: string, otpType: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/send`, {
      reference,
      otpType
    });
  }

  verifyOtp(
    reference: string,
    otpType: string,
    otpCode: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/otp/verify`, {
      reference,
      otpType,
      otpCode
    });
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, payload);
  }

  /* ===============================
     LOGIN FLOW
  =============================== */

  login(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, payload);
  }

  /* ===============================
     USER SESSION
  =============================== */

  me(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/auth/me`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rememberEmail');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  saveRememberEmail(email: string): void {
    localStorage.setItem('rememberEmail', email);
  }

  getRememberEmail(): string {
    return localStorage.getItem('rememberEmail') || '';
  }

  /* ===============================
     PRIVATE HELPERS
  =============================== */

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}