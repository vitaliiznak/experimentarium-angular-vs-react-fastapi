import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    AuthFormComponent,
    FormFieldComponent
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  error: string = '';
  success: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Invalid or missing reset token';
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    }
  }

  shouldShowError(controlName: string): boolean {
    const control = this.resetForm.get(controlName);
    return (control?.invalid && (control?.touched || this.submitted)) ?? false;
  }

  getPasswordErrorMessage(): string {
    const control = this.resetForm.get('password');
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Password is required';
    }
    if (control.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const control = this.resetForm.get('confirmPassword');
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Please confirm your password';
    }
    if (this.resetForm.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    
    if (this.resetForm.valid && this.token) {
      this.isLoading = true;
      this.error = '';
      this.success = '';

      const newPassword = this.resetForm.get('password')?.value;
      
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.success = 'Password successfully reset!';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error?.error?.message || 'Failed to reset password. Please try again.';
          if (error?.error?.detail === 'Invalid or expired token') {
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 3000);
          }
        }
      });
    }
  }
}
