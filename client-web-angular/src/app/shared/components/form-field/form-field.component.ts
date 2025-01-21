import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-field">
      <label [for]="fieldId">{{ label }}</label>
      <input
        [type]="type"
        [id]="fieldId"
        [formControl]="control"
        [placeholder]="placeholder"
      >
      <span class="error-message" *ngIf="showError">
        {{ errorMessage }}
      </span>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    input:focus {
      outline: none;
      border-color: #4CAF50;
    }
    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    }
  `]
})
export class FormFieldComponent {
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() fieldId!: string;
  @Input() controlName!: string;
  @Input() placeholder: string = '';
  @Input() form!: FormGroup;
  @Input() showError: boolean = false;
  @Input() errorMessage: string = '';

  get control(): FormControl {
    return this.form.get(this.controlName) as FormControl;
  }
} 