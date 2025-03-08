import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISignupRequest } from '../../../models/user.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

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
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Signup failed:', error);
          },
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.signupForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
