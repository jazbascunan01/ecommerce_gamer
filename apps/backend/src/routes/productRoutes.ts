import { Router } from "express";
import { IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { createProductController } from "../controllers/product.controller";
import { createAuthMiddleware } from "../middlewares/auth";
import { adminAuth } from "../middlewares/adminAuth";


export const productRoutes = (
    productFinder: IProductFinder,
    unitOfWorkFactory: IUnitOfWorkFactory,
    userFinder: IUserFinder
) => {
    const router = Router();
    const productController = createProductController(productFinder, unitOfWorkFactory);
    const authMiddleware = createAuthMiddleware(userFinder);

    router.get("/", productController.listProducts);
    router.get("/summary/stats", authMiddleware, adminAuth, productController.getProductStats);
    router.get("/:id", productController.findProductById);
    router.post("/", authMiddleware, adminAuth, productController.createProduct);
    router.put("/:id", authMiddleware, adminAuth, productController.updateProduct);
    router.delete('/:id', authMiddleware, adminAuth, productController.deleteProduct);
    return router;
};
