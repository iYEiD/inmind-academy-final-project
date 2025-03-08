import { Component, inject, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PasswordValidators } from '../validators/password-validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnDestroy {
  profileForm: FormGroup;
  isEditMode = false;
  private accountService = inject(AccountService);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group(
      {
        firstName: [{ value: '', disabled: true }, Validators.required],
        lastName: [{ value: '', disabled: true }, Validators.required],
        email: [
          { value: '', disabled: true },
          [Validators.required, Validators.email],
        ],
        address: [{ value: '', disabled: true }, Validators.required],
        currentPassword: [{ value: '', disabled: true }, Validators.required],
        newPassword: [{ value: '', disabled: true }, Validators.required],
        confirmPassword: [{ value: '', disabled: true }, Validators.required],
      },
      { validators: PasswordValidators.passwordValidation() }
    );
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;

    if (this.isEditMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      // Optionally reset form to original values if canceling
      // this.profileForm.reset(this.originalValues);
      // Will fill with current user data from state management later
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

    // Only proceed with save if the form is valid
    if (this.profileForm.valid) {
      this.accountService
        .updateProfile(this.profileForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toggleEditMode();
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          },
        });

      this.toggleEditMode();
      this.profileForm.reset();
      //Update User State After save?
    } else {
      console.log('Form is invalid, please fix the errors');
      //Could add snackbar here
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
