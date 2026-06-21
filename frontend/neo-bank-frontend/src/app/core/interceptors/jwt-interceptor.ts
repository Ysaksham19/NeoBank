// frontend/neo-bank-frontend/src/app/core/interceptors/jwt-interceptor.ts
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

  // ── Guard: only attach if token is a real non-empty string
  //    Prevents "Bearer null" / "Bearer undefined" → 400
  if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};