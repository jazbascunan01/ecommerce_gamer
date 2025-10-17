import { Request, Response, NextFunction } from 'express';
import { DomainError, ProductNotFoundError, CartNotFoundError, InsufficientStockError, InvalidQuantityError, ProductNotInCartError, UserAlreadyExistsError, InvalidCredentialsError, UserNotFoundError, AuthenticationError, AuthorizationError, InvalidEntityStateError } from '@domain/errors/DomainError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Es una buena práctica registrar el error

    // Usar un switch mejora la legibilidad cuando hay múltiples tipos de error.
    switch (true) {
        // 404 Not Found
        case err instanceof ProductNotFoundError:
        case err instanceof CartNotFoundError:
            return res.status(404).json({ error: err.message });

        // 401 Unauthorized
        case err instanceof UserNotFoundError:
        case err instanceof AuthenticationError:
        case err instanceof InvalidCredentialsError:
            return res.status(401).json({ error: "Unauthorized" });

        // 403 Forbidden
        case err instanceof AuthorizationError:
            return res.status(403).json({ error: err.message });

        // 409 Conflict
        case err instanceof UserAlreadyExistsError:
            return res.status(409).json({ error: err.message });

        // 400 Bad Request
        case err instanceof InsufficientStockError:
        case err instanceof InvalidQuantityError:
        case err instanceof ProductNotInCartError:
        case err instanceof InvalidEntityStateError:
            return res.status(400).json({ error: err.message });
    }

    // Para cualquier otro error no capturado, devolvemos un 500 genérico
    return res.status(500).json({ error: 'An internal server error occurred' });
};