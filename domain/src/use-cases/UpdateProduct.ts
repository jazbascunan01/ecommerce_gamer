import { Product } from "../entities/Product";
import { ProductNotFoundError } from "../errors/DomainError";
import { IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";

export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    imageUrl?: string;
}

export class UpdateProduct {
    constructor(
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(productId: string, data: UpdateProductData): Promise<Product> {
        const uow = this.unitOfWorkFactory.create();
        const product = await this.productFinder.findProductById(productId);

        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        product.updateDetails(data);

        uow.products.update(product);
        await uow.commit();

        return product;
    }
}