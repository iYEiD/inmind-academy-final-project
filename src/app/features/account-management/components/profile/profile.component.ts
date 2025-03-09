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
  private snackBar = inject(MatSnackBar);
  private userProfile: UserProfileDTO | null = null;

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
      return; // Don't do anything if not in edit mode
    }

    // Mark all fields as touched to trigger validation messages
    Object.keys(this.profileForm.controls).forEach((key) => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });

    // Check if any required fields are empty
    if (
      this.profileForm.hasError('required', ['email']) ||
      this.profileForm.hasError('required', ['currentPassword']) ||
      // Only check confirmPassword if newPassword has a value
      (this.profileForm.get('newPassword')?.value &&
        !this.profileForm.get('confirmPassword')?.value)
    ) {
      this.showSnackbar(
        'Please confirm your new password and other fields',
        'error'
      );
      return;
    }

    // Check for password validation errors
    if (this.profileForm.hasError('passwordMismatch')) {
      this.showSnackbar('Passwords do not match', 'error');
      return;
    }

    // Only proceed with save if the form is valid
    if (this.profileForm.valid && this.userProfile) {
      const updatedProfile = {
        ...this.profileForm.value,
        id: this.userProfile.id, // Include the user ID from state
      };

      this.accountService
        .updateProfile(updatedProfile)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSnackbar('Profile updated successfully', 'success');
            this.toggleEditMode();
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.showSnackbar(
              'Error updating profile. Please try again.',
              'error'
            );
          },
        });
    } else {
      this.showSnackbar(
        'Old password cannot be the same as new password',
        'error'
      );
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error'): void {
    const config: MatSnackBarConfig = {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass:
        type === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    };
    this.snackBar.open(message, 'X', config);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
