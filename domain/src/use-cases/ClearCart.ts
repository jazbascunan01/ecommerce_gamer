import { CartNotFoundError, ProductNotFoundError } from "../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";

export class ClearCart {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string): Promise<void> {
        const cart = await this.cartFinder.findByUserId(userId);
        if (!cart || cart.items.length === 0) {
            // Si no hay carrito o está vacío, no hay nada que hacer.
            return;
        }

        const uow = this.unitOfWorkFactory.create();

        // Devolver el stock de cada producto en el carrito de forma segura
        for (const item of cart.items) {
            // Recargamos el producto desde la BD para evitar race conditions y tener el stock más actual
            const product = await this.productFinder.findProductById(item.product.id);
            if (!product) {
                // Este caso es improbable si la BD es consistente, pero es una guarda de seguridad
                throw new ProductNotFoundError(item.product.id);
            }
            product.stock += item.quantity;
            uow.products.update(product);
        }

        cart.clear(); // Vaciar los items del carrito
        uow.carts.save(cart); // Guardar el carrito ahora vacío
        await uow.commit();
    }
}