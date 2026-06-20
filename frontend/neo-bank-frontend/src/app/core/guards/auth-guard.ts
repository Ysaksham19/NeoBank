import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage';

export const AuthGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router  = inject(Router);
  if (storage.getToken()) return true;
  router.navigate(['/login']);
  return false;
};
