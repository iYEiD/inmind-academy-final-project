import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { env } from '../../../../environments/env';
import { setUserProfile, updateUserProfile } from './user.actions';
import { UserProfileDTO } from '../../../models/user.model';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private usersUrl = env.usersUrl;

  // Effect to fetch user profile
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[User] Load User Profile'),
      switchMap(() =>
        this.http.get<UserProfileDTO>(`${this.usersUrl}/me`).pipe(
          map((profile) => setUserProfile({ profile })),
          catchError((error) => {
            console.error('Error loading user profile:', error);
            return of({ type: '[User] Load User Profile Error', error });
          })
        )
      )
    )
  );

  // Effect to update user profile
  updateUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserProfile),
      switchMap(({ profile }) =>
        this.http
          .put<UserProfileDTO>(`${this.usersUrl}/${profile.id}`, profile)
          .pipe(
            map((updatedProfile) =>
              setUserProfile({ profile: updatedProfile })
            ),
            catchError((error) => {
              console.error('Error updating user profile:', error);
              return of({ type: '[User] Update User Profile Error', error });
            })
          )
      )
    )
  );
}
