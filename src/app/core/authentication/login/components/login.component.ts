import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IUserLogin } from '../../../../models/user.model';
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
    console.log(this.userLogin);
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
