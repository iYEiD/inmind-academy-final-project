import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userLogin: ILoginRequest = { username: '', password: '' };
  authService = inject(AuthService);
  router = inject(Router);

  onLogin(): void {
    this.authService.login(this.userLogin).subscribe({
      next: () => {
        // maybe can add snackbar here later
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
