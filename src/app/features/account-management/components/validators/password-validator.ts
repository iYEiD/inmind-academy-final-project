import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
} from '@angular/forms';

export class PasswordValidators {
  /**
   * Validator to check if the new password matches the confirm password
   * @returns ValidatorFn that returns null if passwords match, or an error object if they don't
   */
  static passwordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const newPassword = formGroup.get('newPassword')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;

      // If either field is empty, don't validate yet
      if (!newPassword || !confirmPassword) {
        return null;
      }

      // Check if passwords match
      return newPassword === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  /**
   * Validator to check if the new password is different from the old password
   * @returns ValidatorFn that returns null if passwords are different, or an error object if they're the same
   */
  static passwordChanged(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const currentPassword = formGroup.get('currentPassword')?.value;
      const newPassword = formGroup.get('newPassword')?.value;

      // If either field is empty, don't validate yet
      if (!currentPassword || !newPassword) {
        return null;
      }

      // Check if passwords are different
      return currentPassword !== newPassword
        ? null
        : { passwordUnchanged: true };
    };
  }

  /**
   * Combined validator that checks both password match and password change
   * @returns ValidatorFn that performs both validations
   */
  static passwordValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const matchError = PasswordValidators.passwordsMatch()(control);
      const changeError = PasswordValidators.passwordChanged()(control);

      // Combine errors if both exist
      if (matchError && changeError) {
        return { ...matchError, ...changeError };
      }

      // Return whichever error exists, or null if none
      return matchError || changeError;
    };
  }
}
