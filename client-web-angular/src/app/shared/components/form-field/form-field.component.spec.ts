import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormFieldComponent]
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    
    // Setup required inputs
    component.label = 'Test Label';
    component.fieldId = 'test-field';
    component.controlName = 'testControl';
    component.form = formBuilder.group({
      testControl: ['']
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label correctly', () => {
    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toContain('Test Label');
    expect(labelElement.getAttribute('for')).toBe('test-field');
  });

  it('should render input with correct attributes', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('id')).toBe('test-field');
    expect(inputElement.getAttribute('type')).toBe('text'); // default type
  });

  it('should show error message when showError is true', () => {
    component.showError = true;
    component.errorMessage = 'Test error message';
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement.textContent).toContain('Test error message');
  });

  it('should not show error message when showError is false', () => {
    component.showError = false;
    component.errorMessage = 'Test error message';
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement).toBeNull();
  });

  it('should handle different input types', () => {
    component.type = 'password';
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.getAttribute('type')).toBe('password');
  });
}); 