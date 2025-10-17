import { CartNotFoundError, ProductNotFoundError } from "../../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../../services/IPersistence";

export class ClearCart {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string): Promise<void> {
        const cart = await this.cartFinder.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            return;
        }

        const uow = this.unitOfWorkFactory.create();

        for (const item of cart.items) {
            const product = await this.productFinder.findProductById(item.product.id.toString());
            if (!product) {
                throw new ProductNotFoundError(item.product.id.toString());
            }
            product.adjustStock(item.quantity);
            uow.products.update(product);
        }

        cart.clear();
        uow.carts.save(cart);
        await uow.commit();
    }
}