import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { StorageService } from '../services/storage';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router  = inject(Router);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // ── Auto-logout only on protected endpoint 401s (not login/register)
      if (error.status === 401 && !req.url.includes('/auth/')) {
        storage.clear();
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};