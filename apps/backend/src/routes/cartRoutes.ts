import { Router } from "express";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createCartController } from "../controllers/cart.controller";
import { AuthenticationError, UserNotFoundError } from "@domain/errors/DomainError";

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
    router.use(async (req, res, next) => { // Ahora puede lanzar errores
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return next(new AuthenticationError("Unauthorized: User ID header is missing"));
        }

        const user = await userFinder.findById(userId);
        if (!user) {
            // Lanzamos un error que será capturado por el errorHandler central.
            return next(new UserNotFoundError(userId));
        }
        (req as any).userId = userId; // Adjuntamos el userId a la request
        next();
    });

    // Las rutas ahora solo mapean al controlador
    router.get("/", cartController.getCart);
    router.post("/add", cartController.addProductToCart);
    router.post("/remove", cartController.removeProductFromCart);
    router.post("/update", cartController.updateCartItem);
    router.post("/clear", cartController.clearCart);
    return router;
};