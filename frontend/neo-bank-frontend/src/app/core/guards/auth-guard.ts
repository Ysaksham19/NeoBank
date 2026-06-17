import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

export const AuthGuard: CanActivateFn = (

  route,

  state

) => {

  const router =
    inject(Router);

  // =========================================================
  // GET TOKEN
  // =========================================================

  const token =
    localStorage.getItem('token');

  // =========================================================
  // CHECK AUTH
  // =========================================================

  if (token) {

    return true;
  }

  // =========================================================
  // REDIRECT TO LOGIN
  // =========================================================

  router.navigate([
    '/login'
  ]);

  return false;
};