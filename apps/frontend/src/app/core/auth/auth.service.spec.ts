import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let routerSpy: jasmine.SpyObj<Router>;

  // Mock del token JWT para un usuario administrador (con fecha de expiración futura)
  const mockAdminToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJuYW1lIjoiQWRtaW4iLCJyb2xlIjoiQURNSU4iLCJleHAiOjk5OTk5OTk5OTl9.somefakesignature';

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  function createService(): void {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  describe('#login', () => {
    it('should send a POST request and save the token on successful login', fakeAsync(() => {
      createService();
      const credentials = { email: 'admin@example.com', password: 'password123' };
      const mockResponse = { token: mockAdminToken };

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`http://localhost:3000/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);

      req.flush(mockResponse);
      tick();
    }));

    it('should update user$ observable on successful login', fakeAsync(() => {
      createService();
      const credentials = { email: 'admin@example.com', password: 'password123' };
      const mockResponse = { token: mockAdminToken };

      const users: (User | null)[] = [];
      service.user$.subscribe(u => users.push(u));

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`http://localhost:3000/api/auth/login`);
      req.flush(mockResponse);

      tick();

      const lastUser = users[users.length - 1];
      expect(lastUser).not.toBeNull();
      if (lastUser) {
        expect(lastUser.role).toBe('ADMIN');
        expect(lastUser.email).toBe('admin@example.com');
        expect(lastUser.name).toBe('Admin');
      }
    }));
  });

  describe('#logout', () => {
    it('should clear the token from localStorage and call router.navigate', fakeAsync(() => {
      localStorage.setItem('auth-token', mockAdminToken);
      createService();
      tick();

      service.logout();
      tick();

      expect(localStorage.getItem('auth-token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);

      const users: (User | null)[] = [];
      service.user$.subscribe(u => users.push(u));

      const lastUser = users[users.length - 1];
      expect(lastUser).toBeNull();
    }));
  });

  describe('#register', () => {
    it('should send a POST request with user data', fakeAsync(() => {
      createService();
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      service.register(newUser).subscribe();

      const req = httpMock.expectOne(`http://localhost:3000/api/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);

      req.flush({ message: 'User registered successfully' });
      tick();
    }));
  });

  describe('on startup', () => {
    it('should set user$ from a valid token in localStorage', fakeAsync(() => {
      localStorage.setItem('auth-token', mockAdminToken);
      createService();

      const users: (User | null)[] = [];
      service.user$.subscribe(u => users.push(u));

      tick();

      const lastUser = users[users.length - 1];
      expect(lastUser).not.toBeNull();
      if (lastUser) {
        expect(lastUser.role).toBe('ADMIN');
        expect(lastUser.email).toBe('admin@example.com');
      }
    }));

    it('should keep user$ as null if no token is found', fakeAsync(() => {
      createService();

      const users: (User | null)[] = [];
      service.user$.subscribe(u => users.push(u));

      tick();

      const lastUser = users[users.length - 1];
      expect(lastUser).toBeNull();
    }));
  });
});
