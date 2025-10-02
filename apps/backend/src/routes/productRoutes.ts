import { Router } from "express";
import { IProductFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";
import { createProductController } from "../controllers/product.controller";

export const productRoutes = (
    productFinder: IProductFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const router = Router();
    const productController = createProductController(productFinder, unitOfWorkFactory);


    router.get("/", productController.listProducts);
    router.post("/", productController.createProduct);


    return router;
};
