import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';
import { CookieService } from 'ngx-cookie-service';
import { ILoginRequest, IAuthResponse } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private authApiService: AuthApiService,
    private cookieService: CookieService
  ) {}

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.authApiService.login(credentials).pipe(
      tap((response) => {
        this.cookieService.set('accessToken', response.accessToken);
        this.cookieService.set('refreshToken', response.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('accessToken');
  }
}
