import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  loadUserProfile,
  updateUserProfile,
} from '../../../shared/states/user/user.actions';
import {
  selectUserProfile,
  selectUserAddress,
} from '../../../shared/states/user/user.selectors';
import { IUserAddress, UserProfileDTO } from '../../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountFacade {
  private store = inject(Store);

  // Selectors
  userProfile$: Observable<UserProfileDTO> =
    this.store.select(selectUserProfile);
  userAddress$: Observable<IUserAddress> = this.store.select(selectUserAddress);

  // Actions
  loadUserProfile(): void {
    this.store.dispatch(loadUserProfile());
  }

  updateUserProfile(profile: UserProfileDTO): void {
    this.store.dispatch(updateUserProfile({ profile }));
  }
}
