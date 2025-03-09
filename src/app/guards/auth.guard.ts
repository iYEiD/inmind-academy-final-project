import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/authentication/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Show notification and redirect to login
  notificationService.showNotification(
    'Please login first to access this page',
    'error'
  );
  router.navigate(['/login']);
  return false;
};
