import { Router } from "express";
import { AuthService } from "@domain/services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { createUserController } from "../controllers/user.controller";

export const userRoutes = (
    userFinder: IUserFinder,
    uowFactory: IUnitOfWorkFactory,
    authService: AuthService
) => {
    const router = Router();
    const userController = createUserController(userFinder, uowFactory, authService);

    router.post("/register", userController.register);
    router.post("/login", userController.login);

    return router;
};
