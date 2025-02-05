import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthFormComponent,
    FormFieldComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  error: string = '';
  success: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getEmailErrorMessage(): string {
    const control = this.forgotPasswordForm.get('email');
    if (control?.errors?.['required']) return 'Email is required';
    if (control?.errors?.['email']) return 'Please enter a valid email';
    return '';
  }

  shouldShowError(controlName: string): boolean {
    const control = this.forgotPasswordForm.get(controlName);
    return (control?.invalid && (control?.touched || this.submitted)) ?? false;
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) return;

    this.isLoading = true;
    this.error = '';
    this.success = '';

    try {
      await this.authService.forgotPassword(this.forgotPasswordForm.value.email);
      this.success = 'Password reset instructions have been sent to your email';
    } catch (error: any) {
      this.error = error.message || 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
} 