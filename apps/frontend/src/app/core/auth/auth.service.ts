import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Corregido: la ruta es /api/auth

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  public isAdmin$: Observable<boolean> = this.user$.pipe(
    map(user => user?.role === 'ADMIN')
  );

  constructor(private http: HttpClient) {
    this.checkTokenOnLoad();
  }

  /**
   * Envía las credenciales al backend para iniciar sesión.
   * @param credentials Objeto con email y password.
   * @returns Un observable con la respuesta del backend (que debería incluir el token y datos del usuario).
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(      tap(response => {
        if (response && response.token) {
          this.handleAuthentication(response.token);
        }
      })
    );
  }

  /**
   * Envía los datos de un nuevo usuario al backend para su registro.
   * @param userData Objeto con name, email y password.
   * @returns Un observable con la respuesta del backend.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.userSubject.next(null);
  }

  /**
   * Procesa el token después de un login exitoso.
   * @param token El token JWT.
   */
  private handleAuthentication(token: string): void {
    this.saveToken(token);
    const decodedToken: any = jwtDecode(token);
    const user: User = { id: decodedToken.id, email: decodedToken.email, name: decodedToken.name, role: decodedToken.role };
    this.userSubject.next(user);
  }

  /**
   * Guarda el token en localStorage.
   * @param token El token JWT recibido del backend.
   */
  private saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Obtiene el token de localStorage.
   * Usado principalmente por el AuthInterceptor.
   */
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Verifica si hay un token en localStorage al cargar la aplicación.
   * Si el token existe y no ha expirado, actualiza el estado del usuario.
   */
  private checkTokenOnLoad(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
          this.logout();
        } else {
          const user: User = { id: decodedToken.id, email: decodedToken.email, name: decodedToken.name, role: decodedToken.role };
          this.userSubject.next(user);
        }
      } catch (error) {
        this.logout();
      }
    }
  }
}
