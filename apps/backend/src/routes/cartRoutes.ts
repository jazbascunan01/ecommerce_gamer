import { Router } from "express";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createCartController } from "../controllers/cart.controller";
import { AuthenticationError, UserNotFoundError } from "@domain/errors/DomainError";
import jwt from 'jsonwebtoken';

export const cartRoutes = (
    cartFinder: ICartFinder,
    productFinder: IProductFinder,
    userFinder: IUserFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const router = Router();
    // Pasamos solo las dependencias que el controlador necesita
    const cartController = createCartController(cartFinder, productFinder, unitOfWorkFactory);

    // Middleware de autenticación
    router.use(async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AuthenticationError("Unauthorized: No token provided.");
            }

            const token = authHeader.split(' ')[1];
            const secretKey = 'YOUR_SUPER_SECRET_KEY'; // Debe ser la misma clave secreta

            const decoded = jwt.verify(token, secretKey) as { id: string };
            const user = await userFinder.findById(decoded.id);

            if (!user) {
                throw new UserNotFoundError(decoded.id);
            }

            (req as any).userId = user.id; // Adjuntamos el userId a la request
            next();
        } catch (error) {
            next(new AuthenticationError("Unauthorized: Invalid token."));
        }
    });

    // Las rutas ahora solo mapean al controlador
    router.get("/", cartController.getCart);
    router.post("/add", cartController.addProductToCart);
    router.delete("/items/:productId", cartController.removeProductFromCart);
    router.post("/update", cartController.updateCartItem);
    router.post("/clear", cartController.clearCart);
    return router;
};