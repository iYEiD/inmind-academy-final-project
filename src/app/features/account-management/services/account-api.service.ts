import { inject, Injectable } from '@angular/core';
import { env } from '../../../../environments/env';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  private usersUrl = env.usersUrl;
  http = inject(HttpClient);

  constructor() {}

  updateProfile(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(`${this.usersUrl}/${user.id}`, user);
  }
}
