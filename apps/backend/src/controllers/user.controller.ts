import { Request, Response } from "express";
import { RegisterUser } from "@domain/use-cases/RegisterUser";
import { LoginUser } from "@domain/use-cases/LoginUser";
import { IUserFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { AuthService } from "@domain/services/AuthService";
import { UserAlreadyExistsError, UserNotFoundError, InvalidCredentialsError } from "@domain/errors/DomainError";

export const createUserController = (
    userFinder: IUserFinder,
    unitOfWorkFactory: IUnitOfWorkFactory,
    authService: AuthService
) => {
    const registerUser = async (req: Request, res: Response) => {
        const registerUserCase = new RegisterUser(userFinder, unitOfWorkFactory, authService);
        try {
            const { name, email, password } = req.body;
            const user = await registerUserCase.execute(name, email, password);
            res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (err: any) {
            if (err instanceof UserAlreadyExistsError) {
                return res.status(409).json({ error: err.message });
            }
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    const loginUser = async (req: Request, res: Response) => {
        const loginUserCase = new LoginUser(userFinder, authService);
        try {
            const { email, password } = req.body;
            const user = await loginUserCase.execute(email, password);
            // En una app real, aquí generarías un token (JWT)
            res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
        } catch (err: any) {
            if (err instanceof UserNotFoundError || err instanceof InvalidCredentialsError) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    return {
        registerUser,
        loginUser,
    };
};