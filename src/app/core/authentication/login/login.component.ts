import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../../models/auth.model';
import { Subject, takeUntil } from 'rxjs';
import { AccountFacade } from '../facades/account.facade';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  private fb = inject(FormBuilder);
  private $destroy = new Subject<void>();
  private accountFacade = inject(AccountFacade);
  private notificationService = inject(NotificationService);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const userLogin: ILoginRequest = this.loginForm.value;
      this.authService
        .login(userLogin)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (response) => {
            this.accountFacade.loadUserProfile();
            this.notificationService.showNotification(
              `Welcome back, ${userLogin.username}!`,
              'success'
            );
            this.router.navigate(['/admin/products']);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.notificationService.showNotification(
              'Login failed. Please check your credentials.',
              'error'
            );
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
      this.notificationService.showNotification(
        'Please fill all input fields',
        'error'
      );
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
