import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '@domain/errors/DomainError';

/**
 * Middleware para verificar si el usuario tiene rol de 'ADMIN'.
 * Debe ejecutarse DESPUÉS del middleware de autenticación principal.
 */
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).userRole !== 'ADMIN') {
        return next(new AuthorizationError("Acceso denegado: Se requiere rol de administrador."));
    }
    next();
};