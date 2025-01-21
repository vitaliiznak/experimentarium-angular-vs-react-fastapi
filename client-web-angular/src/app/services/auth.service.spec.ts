import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockLoginResponse: LoginResponse = {
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

    it('should store token and user data on successful login', () => {
      service.login(mockLoginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(localStorage.getItem('access_token')).toBe('mock-token');
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockLoginResponse.user));
      });

      const req = httpMock.expectOne('http://localhost:8000/api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorage.setItem('access_token', 'mock-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token exists', () => {
      localStorage.clear();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and currentUser on logout', () => {
      localStorage.setItem('access_token', 'mock-token');
      localStorage.setItem('currentUser', '{"id":1}');
      
      service.logout();
      
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
      });
    });
  });
}); 