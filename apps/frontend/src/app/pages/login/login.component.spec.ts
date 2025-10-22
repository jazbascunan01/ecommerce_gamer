import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/auth.service';
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        // Usamos un mock del AuthService para controlar su comportamiento en las pruebas
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockReturnValue(of({ token: 'fake-token' })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have a valid form when fields are filled correctly', () => {
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should have the submit button disabled if the form is invalid', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]');
    expect(button?.hasAttribute('disabled')).toBeTruthy();

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    fixture.detectChanges();

    expect(button?.hasAttribute('disabled')).toBeFalsy();
  });

  it('should call authService.login on submit', fakeAsync(() => {
    const loginSpy = jest.spyOn(authService, 'login');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');

    component.onSubmit();
    tick();

    expect(loginSpy).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  }));

  it('should navigate to /products on successful login', fakeAsync(() => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');

    component.onSubmit();
    tick();

    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  }));

  it('should set an error message on failed login', () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Invalid credentials')));
    component.loginForm.controls['email'].setValue('wrong@example.com');
    component.loginForm.controls['password'].setValue('wrongpassword');

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciales inválidas. Por favor, inténtalo de nuevo.');
  });
});
