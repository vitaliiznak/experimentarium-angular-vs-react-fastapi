import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthFormComponent,
    FormFieldComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  signupError: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  getEmailErrorMessage(): string {
    const control = this.signupForm.get('email');
    if (control?.errors?.['required']) return 'Email is required';
    if (control?.errors?.['email']) return 'Please enter a valid email';
    if (control?.errors?.['emailTaken']) return 'This email is already registered';
    return '';
  }

  getPasswordErrorMessage(): string {
    const control = this.signupForm.get('password');
    if (control?.errors?.['required']) return 'Password is required';
    if (control?.errors?.['minlength']) return 'Password must be at least 8 characters';
    return '';
  }

  shouldShowError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return (control?.invalid && (control?.touched || this.submitted)) ?? false;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.signupForm.invalid) {
      this.signupError = 'Please fix the errors above before submitting';
      return;
    }

    this.isLoading = true;
    this.signupError = '';

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error?.error?.detail === 'Email already registered') {
          this.signupError = 'This email is already registered. Please use a different email or try logging in.';
          const emailControl = this.signupForm.get('email');
          emailControl?.setErrors({ 'emailTaken': true });
          emailControl?.markAsTouched();
        } else {
          this.signupError = error?.error?.detail || 'Signup failed. Please try again.';
        }
        // Ensure change detection runs
        this.cdr.detectChanges();
      }
    });
  }
} 