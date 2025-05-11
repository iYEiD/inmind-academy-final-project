import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserProfileDTO } from '../../../models/user.model';

export const selectUserState = createFeatureSelector<UserProfileDTO>('user');

export const selectUserProfile = createSelector(
  selectUserState,
  (state) => state
);

export const selectUserAddress = createSelector(
  selectUserState,
  (state) => state.address
);

export const selectIsAdmin = createSelector(
  selectUserProfile,
  (profile) => profile?.role === 'admin'
);
