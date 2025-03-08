import { Component } from '@angular/core';
import { ISignupRequest } from '../../../models/user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  userSignup: ISignupRequest = { username: '', email: '', password: '' };

  onSignup(): void {
    // This will be implemented later
    console.log('Signup form submitted', this.userSignup);
  }
}
