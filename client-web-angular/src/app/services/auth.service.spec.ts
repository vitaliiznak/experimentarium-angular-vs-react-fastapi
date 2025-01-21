import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockLoginResponse = {
    access_token: 'mock-token',
    token_type: 'Bearer',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      created_at: '2024-01-21',
      updated_at: '2024-01-21'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should store token and user data on successful login', (done) => {
      const credentials = { email: 'test@example.com', password: 'password' };

      service.login(credentials).subscribe(() => {
        expect(localStorage.getItem('auth_token')).toBe('mock-token');
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockLoginResponse.user));
        done();
      });

      const req = httpMock.expectOne(`${service.API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorage.setItem('auth_token', 'mock-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when no access token exists', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('logout', () => {
    it('should clear localStorage and currentUser on logout', () => {
      // Setup initial state
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('currentUser', JSON.stringify(mockLoginResponse.user));
      service.currentUserSubject.next(mockLoginResponse.user);

      // Perform logout
      service.logout();

      // Verify everything is cleared
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.currentUserSubject.value).toBeNull();
    });
  });
}); 