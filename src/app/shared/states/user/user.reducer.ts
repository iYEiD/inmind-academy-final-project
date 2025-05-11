import { createReducer, on } from '@ngrx/store';
import {
  clearUserProfile,
  setUserProfile,
  updateUserProfile,
} from './user.actions';
import { UserProfileDTO } from '../../../models/user.model';

export const initialUserState: UserProfileDTO = {
  id: -1,
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    address: '',
    city: '',
    state: '',
    country: '',
  },
  image: '',
  role: '',
};

export const userReducer = createReducer(
  initialUserState,
  on(setUserProfile, (state, { profile }) => ({ ...state, ...profile })),
  on(clearUserProfile, () => initialUserState),
  on(updateUserProfile, (state, { profile }) => ({ ...state, ...profile }))
);
