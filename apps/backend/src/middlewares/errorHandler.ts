import {Request, Response, NextFunction} from 'express';
import {
    ProductNotFoundError,
    CartNotFoundError,
    InsufficientStockError,
    InvalidQuantityError,
    ProductNotInCartError,
    UserAlreadyExistsError,
    InvalidCredentialsError,
    UserNotFoundError,
    AuthenticationError,
    AuthorizationError,
    InvalidEntityStateError
} from '@domain/errors/DomainError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    switch (true) {
        case err instanceof ProductNotFoundError:
        case err instanceof CartNotFoundError:
            return res.status(404).json({error: err.message});
        case err instanceof UserNotFoundError:
        case err instanceof AuthenticationError:
        case err instanceof InvalidCredentialsError:
            return res.status(401).json({error: "Unauthorized"});
        case err instanceof AuthorizationError:
            return res.status(403).json({error: err.message});
        case err instanceof UserAlreadyExistsError:
            return res.status(409).json({error: err.message});
        case err instanceof InsufficientStockError:
        case err instanceof InvalidQuantityError:
        case err instanceof ProductNotInCartError:
        case err instanceof InvalidEntityStateError:
            return res.status(400).json({error: err.message});
    }

    return res.status(500).json({error: 'An internal server error occurred'});
};