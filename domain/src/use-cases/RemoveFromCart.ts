import { ProductNotFoundError } from "../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";

export class RemoveFromCart {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string, productId: string): Promise<void> {
        const cart = await this.cartFinder.findOrCreateByUserId(userId);
        const itemToRemove = cart.items.find(item => item.product.id === productId);

        if (!itemToRemove) {
            // Opcional: puedes lanzar un error si el item no está en el carrito
            return;
        }

        const product = await this.productFinder.findProductById(productId);
        if (!product) throw new ProductNotFoundError(productId);

        product.stock += itemToRemove.quantity; // Devolvemos el stock
        cart.removeItem(productId);

        const uow = this.unitOfWorkFactory.create();
        uow.products.update(product);
        uow.carts.save(cart);
        await uow.commit();
    }
}
