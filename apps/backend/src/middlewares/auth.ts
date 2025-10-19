import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, UserNotFoundError } from '@domain/errors/DomainError';
import { IUserFinder } from '@domain/services/IPersistence';

export const createAuthMiddleware = (userFinder: IUserFinder) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AuthenticationError("Unauthorized: No token provided.");
            }
            const token = authHeader.split(' ')[1];
            const secretKey = 'YOUR_SUPER_SECRET_KEY';
            const decoded = jwt.verify(token, secretKey) as { id: string };
            const user = await userFinder.findById(decoded.id);

            if (!user) {
                throw new UserNotFoundError(decoded.id);
            }

            (req as any).userId = user.id.toString();
            (req as any).userRole = user.role;
            next();
        } catch (error) {
            next(new AuthenticationError("Token inválido o expirado."));        }
    };
};