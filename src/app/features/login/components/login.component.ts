import { Component } from '@angular/core';
import { AuthService } from '../../../core/authentication/auth.service';
import { IUserLogin } from '../../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userLogin: IUserLogin = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.userLogin).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Login failed', error);
      },
    });
  }
}
