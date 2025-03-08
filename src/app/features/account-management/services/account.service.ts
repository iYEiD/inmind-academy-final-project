import { inject, Injectable } from '@angular/core';
import { AccountApiService } from './account-api.service';
import { IUser } from '../../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private accountApiService = inject(AccountApiService);

  constructor() {}

  updateProfile(user: IUser): Observable<IUser> {
    return this.accountApiService.updateProfile(user);
  }
}
