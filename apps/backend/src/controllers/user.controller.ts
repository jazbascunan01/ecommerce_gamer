import { Request, Response, NextFunction } from "express";
import { AuthService } from "@domain/services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import jwt from 'jsonwebtoken';
import { RegisterUser } from '@domain/use-cases/user/RegisterUser';
import { LoginUser } from '@domain/use-cases/user/LoginUser';

export const createUserController = (
    userFinder: IUserFinder,
    uowFactory: IUnitOfWorkFactory,
    authService: AuthService
) => {
    const registerUserCase = new RegisterUser(userFinder, uowFactory, authService);
    const loginUserCase = new LoginUser(userFinder, authService);

    const register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            const user = await registerUserCase.execute(name, email, password);
            res.status(201).json({ id: user.id.toString(), name: user.name, email: user.email, role: user.role });
        } catch (err: any) {
            next(err);
        }
    };

    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const user = await loginUserCase.execute(email, password);
            const secretKey = process.env.JWT_SECRET;
            if (!secretKey) {
                throw new Error('JWT_SECRET no está configurado en el entorno.');
            }
            const token = jwt.sign({ id: user.id.toString(), name: user.name, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ token });

        } catch (err: any) {
            next(err);
        }
    };

    return { register, login };
};