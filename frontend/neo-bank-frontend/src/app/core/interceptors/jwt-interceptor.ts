import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const storageService = inject(StorageService);

  // ── Skip token injection for all auth endpoints
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  const token = storageService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};