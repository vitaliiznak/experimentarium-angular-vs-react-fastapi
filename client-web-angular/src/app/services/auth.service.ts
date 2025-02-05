import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public readonly API_URL = 'http://localhost:8000/api';
  private _currentUser = signal<User | null>(null);
  public currentUser = this._currentUser.asReadonly();
  
  constructor(private router: Router) {
    // Initialize user from localStorage on service creation
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        this._currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) throw new Error('Login failed');
      
      const data: LoginResponse = await response.json();
      this._currentUser.set(data.user);
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      return data;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  async signup(credentials: any): Promise<AuthResponse> {
    const response = await fetch(`${this.API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw new Error('Signup failed');
    
    const data: AuthResponse = await response.json();
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    this._currentUser.set(data.user);
    return data;
  }

  async logout(): Promise<void> {
    await fetch(`${this.API_URL}/auth/logout`, { method: 'POST' });
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  async forgotPassword(email: string) {
    const response = await fetch(`${this.API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
  });
    
    if (!response.ok) throw new Error('Password reset failed');
    return response.json();
   }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    const response = await fetch(`${this.API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, new_password: newPassword })
    });
    
    if (!response.ok) throw new Error('Password reset failed');
    return response.json();
  }
  

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
    this._currentUser.set(user);
  }

  // Add helper method to clear auth data
  private clearAuthData(): void {
    this._currentUser.set(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
  }
} 