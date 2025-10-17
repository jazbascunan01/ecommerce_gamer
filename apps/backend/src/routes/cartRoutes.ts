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
    const cartController = createCartController(cartFinder, productFinder, unitOfWorkFactory);

    const authMiddleware = createAuthMiddleware(userFinder);
    router.use(authMiddleware);

    router.get("/", cartController.getCart);
    router.post("/items", cartController.addProductToCart);
    router.delete("/items/:productId", cartController.removeProductFromCart);
    router.patch("/items/:productId", cartController.updateCartItem);
    router.post("/clear", cartController.clearCart);
    return router;
};