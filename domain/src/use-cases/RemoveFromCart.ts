import { CartNotFoundError, ProductNotFoundError, ProductNotInCartError } from "../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";

export class RemoveFromCart {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string, productId: string): Promise<void> {
        const cart = await this.cartFinder.findByUserId(userId);
        // Optimización: Si no hay carrito o está vacío, no hay nada que eliminar.
        if (!cart || cart.items.length === 0) {
            return;
        }

        const itemToRemove = cart.items.find(item => item.product.id === productId);

        if (!itemToRemove) {
            // Si el item no está en el carrito, el estado deseado ya se cumple. No hay nada que hacer.
            return;
        }

        // Recargamos el producto para asegurar que tenemos el stock más actual antes de modificarlo
        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            // Este caso es improbable si la BD es consistente, pero es una guarda de seguridad
            throw new ProductNotFoundError(productId);
        }

        const uow = this.unitOfWorkFactory.create();
        product.stock += itemToRemove.quantity; // Devolvemos el stock
        cart.removeItem(productId);

        uow.products.update(product);
        uow.carts.save(cart);
        await uow.commit();
    }
}
