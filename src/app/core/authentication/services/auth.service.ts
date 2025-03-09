import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';
import { CookieService } from 'ngx-cookie-service';
import {
  ILoginRequest,
  IAuthResponse,
  ISignupRequest,
} from '../../../models/auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authApiService = inject(AuthApiService);
  cookieService = inject(CookieService);

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.authApiService.login(credentials).pipe(
      tap((response) => {
        this.cookieService.set('accessToken', response.accessToken, {
          path: '/',
          secure: true,
          sameSite: 'Strict',
        });
        this.cookieService.set('refreshToken', response.refreshToken, {
          path: '/',
          secure: true,
          sameSite: 'Strict',
        });
      })
    );
  }

  logout(): void {
    this.cookieService.delete('accessToken', '/');
    this.cookieService.delete('refreshToken', '/');
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('accessToken');
  }

  isAdmin(): Observable<boolean> {
    return this.authApiService.getAdmin();
  }

  signup(user: ISignupRequest): Observable<string> {
    return this.authApiService.signup(user);
  }
}
