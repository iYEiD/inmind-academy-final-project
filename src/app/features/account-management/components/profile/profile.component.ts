import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PasswordValidators } from '../validators/password-validator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AccountFacade } from '../../../../core/authentication/facades/account.facade';
import { UserProfileDTO } from '../../../../models/user.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  profileForm: FormGroup;
  isEditMode = false;
  private accountService = inject(AccountService);
  private accountFacade = inject(AccountFacade);
  private destroy$ = new Subject<void>();
  private userProfile: UserProfileDTO | null = null;
  private notificationService = inject(NotificationService);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group(
      {
        firstName: [{ value: '', disabled: true }],
        lastName: [{ value: '', disabled: true }],
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],
        address: [{ value: '', disabled: true }],
        currentPassword: [{ value: '', disabled: true }, Validators.required],
        newPassword: [{ value: '', disabled: true }],
        confirmPassword: [{ value: '', disabled: true }],
      },
      { validators: PasswordValidators.passwordValidation() }
    );
  }

  ngOnInit(): void {
    // Subscribe to user profile data and populate form
    this.accountFacade.userProfile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile) => {
        if (profile) {
          this.userProfile = profile;
          this.profileForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            address: profile.address.address,
            // Password fields remain empty
          });
        }
      });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();

      // Reset form to original values from state when canceling edit
      if (this.userProfile) {
        this.profileForm.patchValue({
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          email: this.userProfile.email,
          address: this.userProfile.address.address,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    }
  }

  saveChanges(): void {
    if (!this.isEditMode) {
      return;
    }

    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });

    if (
      this.profileForm.hasError('required', ['email']) ||
      this.profileForm.hasError('required', ['currentPassword']) ||
      (this.profileForm.get('newPassword')?.value &&
        !this.profileForm.get('confirmPassword')?.value)
    ) {
      this.notificationService.showNotification(
        'Please confirm your new password and other fields',
        'error'
      );
      return;
    }

    if (this.profileForm.hasError('passwordMismatch')) {
      this.notificationService.showNotification(
        'Passwords do not match',
        'error'
      );
      return;
    }

    if (this.profileForm.valid && this.userProfile) {
      const updatedAddress = {
        ...this.userProfile.address,
        address: this.profileForm.get('address')?.value,
      };

      const updatedProfile = {
        ...this.profileForm.value,
        id: this.userProfile.id,
        address: updatedAddress,
      };

      this.accountService
        .updateProfile(updatedProfile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            const stateProfile = {
              ...updatedProfile,
              currentPassword: undefined,
              newPassword: undefined,
              confirmPassword: undefined,
            };

            this.accountFacade.updateUserProfile(stateProfile);
            this.notificationService.showNotification(
              'Profile updated successfully',
              'success'
            );
            this.toggleEditMode();
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.notificationService.showNotification(
              'Error updating profile. Please try again.',
              'error'
            );
          },
        });
    } else {
      this.notificationService.showNotification(
        'Old password cannot be the same as new password',
        'error'
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
