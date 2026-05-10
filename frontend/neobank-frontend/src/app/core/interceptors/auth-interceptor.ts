// src/app/core/interceptors/auth.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  /* Public APIs that don't need token */
  const publicUrls = [
    '/auth/login',
    '/auth/register',
    '/auth/register/account-type',
    '/otp/send',
    '/otp/verify',
    '/branches'
  ];

  const isPublic = publicUrls.some(url => req.url.includes(url));

  /* If token exists and route is protected */
  if (token && !isPublic) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  return next(req);
};