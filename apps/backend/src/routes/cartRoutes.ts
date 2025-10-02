import { Router } from "express";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createCartController } from "../controllers/cart.controller";

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
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID header is required" });
        }
        try {
            const user = await userFinder.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            (req as any).userId = userId; // Adjuntamos el userId a la request
            next();
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    // Las rutas ahora solo mapean al controlador
    router.get("/", cartController.getCart);
    router.post("/add", cartController.addProductToCart);
    router.post("/remove", cartController.removeProductFromCart);
    router.post("/update", cartController.updateCartItem);
    router.post("/clear", cartController.clearCart);
    return router;
};