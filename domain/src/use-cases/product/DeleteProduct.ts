import { ProductNotFoundError } from "../../errors/DomainError";
import { IProductFinder, IUnitOfWorkFactory } from "../../services/IPersistence";

export class DeleteProduct {
    constructor(
        private readonly productFinder: IProductFinder,
        private readonly uowFactory: IUnitOfWorkFactory
    ) {}

    async execute(productId: string): Promise<void> {
        const uow = this.uowFactory.create();

        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        uow.products.delete(product);

        await uow.commit();
    }
}