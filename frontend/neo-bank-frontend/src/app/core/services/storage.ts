
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // =========================================================
  // TOKEN KEY
  // =========================================================

  private readonly TOKEN_KEY = 'token';

  private readonly USER_KEY = 'user';

  // =========================================================
  // SAVE TOKEN
  // =========================================================

  saveToken(
    token: string
  ): void {

    localStorage.setItem(
      this.TOKEN_KEY,
      token
    );
  }

  // =========================================================
  // GET TOKEN
  // =========================================================

  getToken(): string | null {

    return localStorage.getItem(
      this.TOKEN_KEY
    );
  }

  // =========================================================
  // REMOVE TOKEN
  // =========================================================

  removeToken(): void {

    localStorage.removeItem(
      this.TOKEN_KEY
    );
  }

  // =========================================================
  // SAVE USER
  // =========================================================

  saveUser(
    user: any
  ): void {

    localStorage.setItem(

      this.USER_KEY,

      JSON.stringify(user)
    );
  }

  // =========================================================
  // GET USER
  // =========================================================

  getUser(): any {

    const user =
      localStorage.getItem(
        this.USER_KEY
      );

    return user
      ? JSON.parse(user)
      : null;
  }

  // =========================================================
  // REMOVE USER
  // =========================================================

  removeUser(): void {

    localStorage.removeItem(
      this.USER_KEY
    );
  }

  // =========================================================
  // CHECK LOGIN
  // =========================================================

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  // =========================================================
  // CLEAR STORAGE
  // =========================================================

  clear(): void {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    localStorage.removeItem(
      this.USER_KEY
    );
  }
}