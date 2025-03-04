import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { env } from '../../../../environments/env';
import {
  ILoginRequest,
  LoginDTO,
  IAuthResponse,
} from '../../../models/auth.model';
import { AuthMapper } from '../../../shared/mappers/auth.mapper';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private authUrl = env.authUrl;
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
}
