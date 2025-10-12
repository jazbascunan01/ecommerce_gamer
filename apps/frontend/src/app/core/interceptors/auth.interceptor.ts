import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

/**
 * Interceptor funcional que se encarga de añadir el token de autenticación
 * a las cabeceras de las peticiones HTTP salientes.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inyectamos el AuthService para acceder a la lógica del token.
  const authService = inject(AuthService);
  const token = authService.getToken();

  // 2. Si no hay token, dejamos pasar la petición original sin modificarla.
  // Esto es crucial para peticiones públicas como el login o el registro.
  if (!token) {
    return next(req);
  }

  // 3. Si hay un token, clonamos la petición y le añadimos la cabecera de autorización.
  // Las peticiones en Angular son inmutables, por eso debemos clonarlas.
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // 4. Dejamos pasar la nueva petición con la cabecera ya incluida.
  return next(authReq);
};