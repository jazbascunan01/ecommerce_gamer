import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { CartNotFoundError, ProductNotFoundError, ProductNotInCartError, InvalidQuantityError, InsufficientStockError } from "../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";

export class UpdateCartItem {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string, productId: string, newQuantity: number): Promise<void> {
        const uow = this.unitOfWorkFactory.create();

        const cart = await this.cartFinder.findByUserId(userId);
        if (!cart) {
            throw new CartNotFoundError(userId);
        }

        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        const itemInCart = cart.findItem(productId);
        if (!itemInCart) {
            throw new ProductNotInCartError(productId);
        }

        // Optimización: Si la cantidad no ha cambiado, no hacemos nada.
        if (itemInCart.quantity === newQuantity) {
            return;
        }

        // La diferencia de cantidad determina cómo ajustamos el stock del producto.
        // Si newQuantity > itemInCart.quantity, la diferencia es positiva y el stock disminuye.
        // Si newQuantity < itemInCart.quantity, la diferencia es negativa y el stock aumenta (se devuelve al almacén).
        const stockAdjustment = itemInCart.quantity - newQuantity;
        try {
            product.adjustStock(stockAdjustment);
        } catch (error) {
            if (error instanceof InsufficientStockError) {
                const availableStock = product.stock + itemInCart.quantity;
                throw new InsufficientStockError(productId, `Not enough stock for '${product.name}'. Only ${availableStock} units available in total.`);
            }
            throw error; // Re-lanzar cualquier otro error inesperado
        }
        cart.setItemQuantity(product, newQuantity);

        uow.products.update(product);
        uow.carts.save(cart);

        await uow.commit();
    }
}