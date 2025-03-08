import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { env } from '../../../../environments/env';
import {
  ILoginRequest,
  LoginDTO,
  IAuthResponse,
} from '../../../models/auth.model';
import { AuthMapper } from '../../../shared/mappers/auth.mapper';
import { ISignupRequest } from '../../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private authUrl = env.authUrl;
  private usersUrl = env.usersUrl;
  http = inject(HttpClient);

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.http
      .post<LoginDTO>(`${this.authUrl}/login`, credentials)
      .pipe(map((dto) => AuthMapper.toAuthResponse(dto)));
  }

  getAdmin(): Observable<boolean> {
    return this.http
      .get<{ role: string }>(`${this.authUrl}/me`)
      .pipe(map((user) => user.role === 'admin'));
  }

  signup(user: ISignupRequest): Observable<string> {
    return this.http
      .post<any>(`${this.usersUrl}/add`, user, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status === 201) {
            return user.username; // Return username on success
          } else {
            throw new Error('User creation failed');
          }
        }),
        catchError((error) => {
          console.error('Signup error:', error);
          throw error;
        })
      );
  }
}
