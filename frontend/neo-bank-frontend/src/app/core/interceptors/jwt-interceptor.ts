import {

  HttpInterceptorFn

} from '@angular/common/http';

import { inject } from '@angular/core';

import { StorageService } from '../services/storage';

export const jwtInterceptor: HttpInterceptorFn = (

  req,

  next

) => {

  // =========================================================
  // INJECT STORAGE SERVICE
  // =========================================================

  const storageService =
    inject(StorageService);

  // =========================================================
  // GET TOKEN
  // =========================================================

  const token =
    storageService.getToken();

  // =========================================================
  // ADD AUTH HEADER
  // =========================================================

  if (token) {

    req = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`
      }
    });
  }

  // =========================================================
  // CONTINUE REQUEST
  // =========================================================

  return next(req);
};