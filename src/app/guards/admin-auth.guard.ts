import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/authentication/services/auth.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    console.log('Not authenticated');
    router.navigate(['/login']);
    return false;
  }

  return authService.isAdmin().pipe(
    map((isAdmin) => {
      if (!isAdmin) {
        router.navigate(['/products']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
