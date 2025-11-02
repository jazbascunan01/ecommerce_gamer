import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  // Observable que indica si el usuario actual es admin
  public isAdmin$: Observable<boolean> = this.user$.pipe(
    map(user => user?.role === 'ADMIN')
  );

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromToken();
  }

  /** Login */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ token: string }>(`http://localhost:3000/api/auth/login`, credentials)
      .pipe(
        tap((response) => {
          const token = response.token;
          localStorage.setItem('auth-token', token);

          const user = this.decodeTokenToUser(token);
          this.userSubject.next(user);
        })
      );
  }

  /** Registro */
  register(data: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`http://localhost:3000/api/auth/register`, data);
  }

  /** Logout */
  logout(): void {
    localStorage.removeItem('auth-token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** Carga usuario desde token almacenado */
  private loadUserFromToken(): void {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const user = this.decodeTokenToUser(token);
      this.userSubject.next(user);
    } else {
      this.userSubject.next(null);
    }
  }

  /** Decodifica el token y devuelve una instancia real de User */
  private decodeTokenToUser(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
      };
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  /** Devuelve el usuario actual */
  get currentUser(): User | null {
    return this.userSubject.value;
  }

  /** Devuelve true si el usuario actual es admin (versión síncrona) */
  get isAdmin(): boolean {
    return this.userSubject.value?.role === 'ADMIN';
  }
}
