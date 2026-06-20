import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage';

export const adminGuard: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router  = inject(Router);
  const user    = storage.getUser();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  if (isAdmin) return true;
  router.navigate(['/dashboard']);
  return false;
};
