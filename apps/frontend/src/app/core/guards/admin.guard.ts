import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin$.pipe(
    take(1), // Tomamos solo el primer valor para evitar suscripciones abiertas.
    map(isAdmin => {
      if (isAdmin) {
        return true; // Si es admin, permite el acceso a la ruta.
      } else {
        // Si no es admin, lo redirigimos a la página de inicio.
        router.navigate(['/']);
        return false;
      }
    })
  );
};