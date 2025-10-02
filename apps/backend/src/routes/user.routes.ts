import { Router } from "express";
import { AuthService } from "@domain/services/AuthService";
import { IUserFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { createUserController } from "../controllers/user.controller";

export const userRoutes = (
    userFinder: IUserFinder,
    unitOfWorkFactory: IUnitOfWorkFactory,
    authService: AuthService
) => {
    const router = Router();
    const userController = createUserController(userFinder, unitOfWorkFactory, authService);

    router.post("/register", userController.registerUser);
    router.post("/login", userController.loginUser);

    return router;
};
