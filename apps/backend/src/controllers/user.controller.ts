import { Request, Response, NextFunction } from "express";
import { AuthService } from "@domain/services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { User } from "@domain/entities/User";
import { InvalidCredentialsError, UserAlreadyExistsError } from "@domain/errors/DomainError";
import jwt from 'jsonwebtoken';

export const createUserController = (
    userFinder: IUserFinder,
    uowFactory: IUnitOfWorkFactory,
    authService: AuthService
) => {
    const register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            const existingUser = await userFinder.findByEmail(email);
            if (existingUser) {
                throw new UserAlreadyExistsError(email);
            }

            const passwordHash = await authService.hashPassword(password);
            const user = new User(undefined, name, email, passwordHash, 'client', new Date());

            const uow = uowFactory.create();
            uow.users.save(user);
            await uow.commit();

            // No devolvemos el hash de la contraseña
            res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (err: any) {
            next(err);
        }
    };

    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const user = await userFinder.findByEmail(email);
            if (!user) {
                // Por seguridad, usamos un error genérico de credenciales inválidas
                throw new InvalidCredentialsError();
            }

            const passwordMatch = await authService.comparePassword(password, user.passwordHash);
            if (!passwordMatch) {
                throw new InvalidCredentialsError();
            }

            // Generar un token JWT
            // ¡Asegúrate de usar una clave secreta más segura y guardarla en variables de entorno!
            const secretKey = 'YOUR_SUPER_SECRET_KEY';
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ token });

        } catch (err: any) {
            next(err);
        }
    };

    return { register, login };
};