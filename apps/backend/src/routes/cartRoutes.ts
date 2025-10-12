import { Router } from "express";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createCartController } from "../controllers/cart.controller";
import { createAuthMiddleware } from "../middlewares/auth";

export const cartRoutes = (
    cartFinder: ICartFinder,
    productFinder: IProductFinder,
    userFinder: IUserFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const router = Router();
    // Pasamos solo las dependencias que el controlador necesita
    const cartController = createCartController(cartFinder, productFinder, unitOfWorkFactory);

    // Middleware de autenticación reutilizable
    // Le pasamos la dependencia que necesita (userFinder)
    const authMiddleware = createAuthMiddleware(userFinder);
    router.use(authMiddleware);

    // Las rutas ahora solo mapean al controlador
    router.get("/", cartController.getCart);
    router.post("/items", cartController.addProductToCart);
    router.delete("/items/:productId", cartController.removeProductFromCart);
    router.patch("/items/:productId", cartController.updateCartItem);
    router.post("/clear", cartController.clearCart);
    return router;
};