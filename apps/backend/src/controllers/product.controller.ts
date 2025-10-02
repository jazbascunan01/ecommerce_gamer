import { Request, Response } from "express";
import { CreateProduct } from "@domain/use-cases/CreateProduct";
import { ListProducts } from "@domain/use-cases/ListProducts";
import { IProductFinder, IUnitOfWorkFactory } from "@domain/services/IPersistence";

export const createProductController = (
    productFinder: IProductFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const createProduct = async (req: Request, res: Response) => {
        const createProductCase = new CreateProduct(unitOfWorkFactory);
        try {
            const { name, description, price, stock } = req.body;
            const product = await createProductCase.execute(name, description, price, stock);
            res.status(201).json(product);
        } catch (err: any) {
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    const listProducts = async (req: Request, res: Response) => {
        const listProductsCase = new ListProducts(productFinder);
        try {
            const products = await listProductsCase.execute();
            res.status(200).json(products);
        } catch (err: any) {
            res.status(500).json({ error: "An internal server error occurred" });
        }
    };

    return {
        createProduct,
        listProducts,
    };
};