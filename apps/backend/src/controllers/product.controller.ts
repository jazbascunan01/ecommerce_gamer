import { Request, Response, NextFunction } from "express";
import { IProductFinder, IUnitOfWorkFactory, IUserFinder } from "@domain/services/IPersistence";
import { CreateProduct } from "@domain/use-cases/CreateProduct";
import { ListProducts } from "@domain/use-cases/ListProducts";
import { UpdateProduct } from "@domain/use-cases/UpdateProduct";
import { GetProductStats } from "@domain/use-cases/GetProductStats";
import { DeleteProduct } from "@domain/use-cases/DeleteProduct";
import { ProductNotFoundError } from "@domain/errors/DomainError";

export const createProductController = (
    productFinder: IProductFinder,
    unitOfWorkFactory: IUnitOfWorkFactory
) => {
    const createProductCase = new CreateProduct(unitOfWorkFactory);
    const listProductsCase = new ListProducts(productFinder);
    const updateProductCase = new UpdateProduct(productFinder, unitOfWorkFactory);
    const getProductStatsCase = new GetProductStats(productFinder);
    const deleteProductCase = new DeleteProduct(productFinder, unitOfWorkFactory);

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
                throw new ProductNotFoundError(id);
            }

            res.status(200).json(product);
        } catch (err: any) {
            next(err);
        }
    };

    const getProductStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await getProductStatsCase.execute();
            res.status(200).json(stats);
        } catch (err: any) {
            next(err);
        }
    };

    const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const updatedProduct = await updateProductCase.execute(id, data);
            res.status(200).json(updatedProduct);
        } catch (err: any) {
            next(err);
        }
    };

    const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await deleteProductCase.execute(id);
            res.status(204).send();
        } catch (err: any) {
            next(err);
        }
    };

    return {
        createProduct,
        listProducts,
        findProductById,
        getProductStats,
        updateProduct,
        deleteProduct,
    };
};