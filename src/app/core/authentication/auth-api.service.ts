import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserLogin } from '../../models/user.model';
import { env } from '../../environments/env';
import { LoginDTOModel } from '../../models/auth.model';
import { map } from 'rxjs/operators';
import { UserDTO } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private authUrl = env.authUrl;

  constructor(private http: HttpClient) {}

  login(credentials: IUserLogin): Observable<LoginDTOModel> {
    return this.http.post<any>(`${this.authUrl}/login`, credentials).pipe(
      map((response) => {
        const user: UserDTO = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        };

        return {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: user,
        };
      })
    );
  }
}
