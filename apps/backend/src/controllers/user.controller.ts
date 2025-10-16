import { Request, Response, NextFunction } from "express";
import { AuthService } from "@domain/services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { InvalidCredentialsError } from "@domain/errors/DomainError";
import jwt from 'jsonwebtoken';
import { RegisterUser } from '@domain/use-cases/RegisterUser';
import { LoginUser } from '@domain/use-cases/LoginUser';

export const createUserController = (
    userFinder: IUserFinder,
    uowFactory: IUnitOfWorkFactory,
    authService: AuthService
) => {
    // Instanciamos el caso de uso aquí, inyectando sus dependencias.
    const registerUserCase = new RegisterUser(userFinder, uowFactory, authService);
    const loginUserCase = new LoginUser(userFinder, authService);

    const register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;

            // Delegamos toda la lógica de registro al caso de uso.
            const user = await registerUserCase.execute(name, email, password);

            // No devolvemos el hash de la contraseña
            // El objeto 'user' que recibimos ya tiene el ID asignado por la base de datos.
            res.status(201).json({ id: user.id.toString(), name: user.name, email: user.email, role: user.role });
        } catch (err: any) {
            next(err);
        }
    };

    const login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            
            // Delegamos la lógica de login al caso de uso.
            // Este se encargará de encontrar al usuario y comparar la contraseña.
            const user = await loginUserCase.execute(email, password);

            // Generar un token JWT
            // ¡Asegúrate de usar una clave secreta más segura y guardarla en variables de entorno!
            const secretKey = 'YOUR_SUPER_SECRET_KEY';
            const token = jwt.sign({ id: user.id.toString(), name: user.name, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ token });

        } catch (err: any) {
            next(err);
        }
    };

    return { register, login };
};