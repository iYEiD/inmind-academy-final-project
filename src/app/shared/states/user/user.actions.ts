import { createAction, props } from '@ngrx/store';
import { UserProfileDTO } from '../../../models/user.model';

export const setUserProfile = createAction(
  '[User] Set User Profile',
  props<{ profile: UserProfileDTO }>()
);

export const clearUserProfile = createAction('[User] Clear User Profile');

export const updateUserProfile = createAction(
  '[User] Update User Profile',
  props<{ profile: UserProfileDTO }>()
);

export const loadUserProfile = createAction('[User] Load User Profile');
