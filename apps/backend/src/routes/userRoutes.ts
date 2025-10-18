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

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Registra un nuevo usuario
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       201:
     *         description: Usuario creado exitosamente
     *       409:
     *         description: El email ya está en uso
     */
    router.post("/register", userController.register);

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Inicia sesión de un usuario
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       200:
     *         description: Login exitoso, devuelve un token JWT
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *       401:
     *         description: Credenciales inválidas
     */
    router.post("/login", userController.login);

    return router;
};
