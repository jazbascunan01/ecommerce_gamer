import { CartNotFoundError, ProductNotFoundError, ProductNotInCartError } from "../../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../../services/IPersistence";

export class RemoveFromCart {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string, productId: string): Promise<void> {
        const cart = await this.cartFinder.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            return;
        }

        const itemToRemove = cart.items.find(item => item.product.id.toString() === productId);

        if (!itemToRemove) {
            return;
        }

        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        const uow = this.unitOfWorkFactory.create();
        product.adjustStock(itemToRemove.quantity);
        cart.removeItem(productId);

        uow.products.update(product);
        uow.carts.save(cart);
        await uow.commit();
    }
}
