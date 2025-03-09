import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISignupRequest } from '../../../models/auth.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnDestroy {
  signupForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  private fb = inject(FormBuilder);
  private $destroy = new Subject<void>();
  private notificationService = inject(NotificationService);

  constructor() {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const userSignup: ISignupRequest = this.signupForm.value;
      this.authService
        .signup(userSignup)
        .pipe(takeUntil(this.$destroy))
        .subscribe({
          next: (username) => {
            this.notificationService.showNotification(
              `Welcome ${username}!`,
              'success'
            );
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Signup failed:', error);
            this.notificationService.showNotification(
              'Signup failed. Please try again.',
              'error'
            );
          },
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.signupForm.markAllAsTouched();
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
