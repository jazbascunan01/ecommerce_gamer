import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from '@domain/errors/DomainError';

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError("Unauthorized: No token provided.");
        }

        const token = authHeader.split(' ')[1];
        const secretKey = 'YOUR_SUPER_SECRET_KEY';
        const decoded = jwt.verify(token, secretKey) as { id: string, role: string };

        if (decoded.role !== 'ADMIN') {
            throw new AuthenticationError("Forbidden: Admin access required.");
        }

        next();
    } catch (error) {
        next(new AuthenticationError("Forbidden: Invalid token or insufficient permissions."));
    }
};