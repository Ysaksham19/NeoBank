
import { Injectable, inject } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import { Router } from '@angular/router';

import { StorageService } from './storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // =========================================================
  // API URL
  // =========================================================

  private readonly BASE_URL =
    'http://localhost:8080/api/v1/auth';

  // =========================================================
  // DEPENDENCIES
  // =========================================================

  private http =
    inject(HttpClient);

  private router =
    inject(Router);

  private storageService =
    inject(StorageService);

  // =========================================================
  // LOGIN
  // =========================================================

  login(
    payload: any
  ): Observable<any> {

    return this.http.post(

      `${this.BASE_URL}/login`,

      payload

    ).pipe(

      tap((response: any) => {

        // ============================================
        // SAVE TOKEN
        // ============================================

        this.storageService.saveToken(
          response.accessToken
        );

        // ============================================
        // SAVE USER
        // ============================================

        this.storageService.saveUser(
          response
        );
      })
    );
  }

  // =========================================================
  // REGISTER
  // =========================================================

  register(
    payload: any
  ): Observable<any> {

    return this.http.post(

      `${this.BASE_URL}/register`,

      payload
    );
  }

  // =========================================================
  // BRANCHES
  // =========================================================

  getBranches(): Observable<any> {

    return this.http.get('http://localhost:8080/api/v1/branches');
  }

  // =========================================================
  // OTP SEND
  // =========================================================

  sendOtp(reference: string, otpType: string): Observable<any> {

    return this.http.post('http://localhost:8080/api/v1/otp/send', {
      reference,
      otpType
    });
  }

  // =========================================================
  // OTP VERIFY
  // =========================================================

  verifyOtp(reference: string, otpType: string, otpCode: string): Observable<any> {

    return this.http.post('http://localhost:8080/api/v1/otp/verify', {
      reference,
      otpType,
      otpCode
    });
  }

  // =========================================================
  // GET CURRENT USER
  // =========================================================

  getCurrentUser(): any {

    return this.storageService.getUser();
  }

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  isLoggedIn(): boolean {

    return this.storageService.isLoggedIn();
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.storageService.clear();

    this.router.navigate([
      '/login'
    ]);
  }
}