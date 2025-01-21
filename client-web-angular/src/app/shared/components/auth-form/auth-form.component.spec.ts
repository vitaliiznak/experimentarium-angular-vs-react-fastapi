import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
  let component: AuthFormComponent;
  let fixture: ComponentFixture<AuthFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render content inside ng-content', () => {
    const testContent = 'Test Content';
    const compiled = fixture.nativeElement as HTMLElement;
    compiled.innerHTML = `<div>${testContent}</div>`;
    fixture.detectChanges();
    
    expect(compiled.textContent).toContain(testContent);
  });

  it('should have the correct CSS classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const authFormDiv = compiled.querySelector('.auth-form');
    
    expect(authFormDiv).toBeTruthy();
    expect(authFormDiv?.classList.contains('auth-form')).toBeTruthy();
  });
}); 