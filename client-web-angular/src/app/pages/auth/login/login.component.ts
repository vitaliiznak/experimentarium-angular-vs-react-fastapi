import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthFormComponent,
    FormFieldComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  getEmailErrorMessage(): string {
    const control = this.loginForm.get('email');
    if (control?.errors?.['required']) return 'Email is required';
    if (control?.errors?.['email']) return 'Please enter a valid email';
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    this.loginError = '';
    
    try {
      await this.authService.login(this.loginForm.value);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.isLoading = false;
      this.loginError = error.message || 'Login failed';
      console.error('Login failed:', error);
    }
  }

  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return (control?.invalid && (control?.touched || this.submitted)) ?? false;
  }
} 