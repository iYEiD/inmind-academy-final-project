import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { env } from '../../../environments/env';
import {
  ILoginRequest,
  LoginDTO,
  IAuthResponse,
} from '../../../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private authUrl = env.authUrl;

  constructor(private http: HttpClient) {}

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.http.post<LoginDTO>(`${this.authUrl}/login`, credentials).pipe(
      map((dto) => ({
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
        user: {
          id: dto.id,
          username: dto.username,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          gender: dto.gender,
          image: dto.image,
        },
      }))
    );
  }
}
