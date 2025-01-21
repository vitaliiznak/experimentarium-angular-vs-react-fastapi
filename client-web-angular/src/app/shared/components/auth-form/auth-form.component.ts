import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="auth-form">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .auth-form {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background: white;
    }
  `]
})
export class AuthFormComponent {} 