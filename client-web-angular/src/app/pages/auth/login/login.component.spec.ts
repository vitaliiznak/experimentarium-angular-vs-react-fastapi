import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { AuthFormComponent } from '../../../shared/components/auth-form/auth-form.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        LoginComponent,
        AuthFormComponent,
        FormFieldComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should show validation errors when form is submitted empty', () => {
    component.onSubmit();
    expect(component.loginForm.get('email')?.errors).toBeTruthy();
    expect(component.loginForm.get('password')?.errors).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should call auth service and navigate on successful login', () => {
    const mockLoginResponse = {
      access_token: 'mock-token',
      token_type: 'Bearer',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    };

    authService.login.and.returnValue(of(mockLoginResponse));
    const navigateSpy = spyOn(router, 'navigate');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should handle login error', () => {
    authService.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.loginError).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });
}); 