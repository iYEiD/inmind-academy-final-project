import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/authentication/services/auth.service';
import { inject } from '@angular/core';
import { NotificationService } from '../shared/services/notification.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (!authService.isAuthenticated()) {
    return true;
  }
  notificationService.showNotification(
    'Please Logout First to access this page',
    'error'
  );
  router.navigate(['/']);
  return false;
};
