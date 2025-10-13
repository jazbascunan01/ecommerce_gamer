import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // La URL base de la API. Las rutas de usuario están en /api/users
  // según la configuración del backend.
  private apiUrl = 'http://localhost:3000/api/auth'; // Corregido: la ruta es /api/auth

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al iniciar el servicio, verificamos si hay un token válido en localStorage.
    this.checkTokenOnLoad();
  }

  /**
   * Envía las credenciales al backend para iniciar sesión.
   * @param credentials Objeto con email y password.
   * @returns Un observable con la respuesta del backend (que debería incluir el token y datos del usuario).
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(      tap(response => {
        // El 'tap' nos permite ejecutar una acción sin modificar la respuesta.
        // Asumimos que el backend devuelve un objeto con una propiedad 'token' y 'user'.
        if (response && response.token) {
          // El backend solo devuelve el token, lo manejamos aquí
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
    // Elimina el token del almacenamiento
    localStorage.removeItem(TOKEN_KEY);
    // Informa a toda la aplicación que ya no hay un usuario logueado
    this.userSubject.next(null);
    // Opcional: podrías querer redirigir al usuario a la página de inicio
    // this.router.navigate(['/']);
  }

  /**
   * Procesa el token después de un login exitoso.
   * @param token El token JWT.
   */
  private handleAuthentication(token: string): void {
    this.saveToken(token);
    const decodedToken: any = jwtDecode(token);
    // Reconstruimos el objeto User a partir del contenido del token
    const user: User = { id: decodedToken.id, email: decodedToken.email, name: decodedToken.name };
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
          this.logout(); // Si el token ha expirado, limpiamos todo.
        } else {
          // Si el token es válido, reconstruimos el objeto de usuario y lo emitimos.
          // El token solo contiene id, email y role. El 'name' no está presente.
          // El token contiene id, name, email y role.
          const user: User = { id: decodedToken.id, email: decodedToken.email, name: decodedToken.name };
          this.userSubject.next(user);
        }
      } catch (error) {
        this.logout(); // Si el token es inválido o malformado, limpiamos todo.
      }
    }
  }
}
