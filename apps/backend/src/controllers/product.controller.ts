import { Request, Response, NextFunction } from "express";
import { IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { CreateProduct } from "@domain/use-cases/CreateProduct";
import { ListProducts } from "@domain/use-cases/ListProducts";
import { ProductNotFoundError } from "@domain/errors/DomainError";

export const createProductController = (
    productFinder: IProductFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const createProductCase = new CreateProduct(unitOfWorkFactory);
    const listProductsCase = new ListProducts(productFinder);

    const createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, description, price, stock, imageUrl } = req.body;
            const product = await createProductCase.execute(name, description, price, stock, imageUrl);
            res.status(201).json(product);
        } catch (err: any) {
            next(err);
        }
    };

    const listProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await listProductsCase.execute();
            res.status(200).json(products);
        } catch (err: any) {
            next(err);
        }
    };

    const findProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const product = await productFinder.findProductById(id);

            if (!product) {
                // Lanzamos un error específico que nuestro errorHandler puede manejar
                throw new ProductNotFoundError(id);
            }

            res.status(200).json(product);
        } catch (err: any) {
            next(err);
        }
    };

    return {
        createProduct,
        listProducts,
        findProductById,
    };
};