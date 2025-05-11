import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthApiService } from './auth-api.service';
import { CookieService } from 'ngx-cookie-service';
import {
  ILoginRequest,
  IAuthResponse,
  ISignupRequest,
} from '../../../models/auth.model';
import { Store } from '@ngrx/store';
import { selectIsAdmin } from '../../../shared/states/user/user.selectors';
import { AccountFacade } from '../facades/account.facade';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authApiService = inject(AuthApiService);
  cookieService = inject(CookieService);
  accountFacade = inject(AccountFacade);
  private store = inject(Store);

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
    this.cookieService.delete('accessToken');
    this.cookieService.delete('refreshToken');
    this.accountFacade.logout();
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('accessToken');
  }

  isAdmin(): Observable<boolean> {
    return this.store.select(selectIsAdmin);
  }

  signup(user: ISignupRequest): Observable<string> {
    return this.authApiService.signup(user);
  }
}
