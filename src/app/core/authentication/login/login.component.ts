import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../../models/auth.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { AccountFacade } from '../facades/account.facade';

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
  private snackBar = inject(MatSnackBar);
  private $destroy = new Subject<void>();
  private accountFacade = inject(AccountFacade);

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

            this.showSnackbar(
              `Welcome back, ${userLogin.username}!`,
              'success'
            );
            this.router.navigate(['/admin/products']);
          },
          error: (error) => {
            console.error('Login failed', error);
            this.showSnackbar(
              'Login failed. Please check your credentials.',
              'error'
            );
          },
        });
    } else {
      // Mark all fields as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
      this.showSnackbar('Please fill all input fields', 'error');
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    const config: MatSnackBarConfig = {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    };
    this.snackBar.open(message, 'X', config);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
