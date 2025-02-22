import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUserLogin } from '../../../../models/user.model';
import { Router } from '@angular/router';
import { ILoginRequest } from '../../../../models/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userLogin: ILoginRequest = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

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
