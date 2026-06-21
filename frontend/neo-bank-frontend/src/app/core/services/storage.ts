import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY  = 'user';

  // ── Token ─────────────────────────────────────────────────────────

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ── User ──────────────────────────────────────────────────────────

  saveUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // ── Auth Check ────────────────────────────────────────────────────

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired(token)) {
      this.clear();       // auto-clean expired token from storage
      return false;
    }
    return true;
  }

  // ── JWT Expiry Helper ─────────────────────────────────────────────

  isTokenExpired(token: string): boolean {
    try {
      const payload  = JSON.parse(atob(token.split('.')[1]));
      const expiryMs = payload.exp * 1000;
      return Date.now() >= expiryMs;
    } catch {
      return true;    // malformed token → treat as expired
    }
  }

  getTokenExpiryMs(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 - Date.now();
    } catch {
      return 0;
    }
  }

  // ── Clear ─────────────────────────────────────────────────────────

  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}