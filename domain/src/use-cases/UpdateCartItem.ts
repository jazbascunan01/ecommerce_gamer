import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { CartNotFoundError, ProductNotFoundError, ProductNotInCartError, InvalidQuantityError } from "../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";

export class UpdateCartItem {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string, productId: string, newQuantity: number): Promise<void> {
        if (newQuantity <= 0) {
            throw new InvalidQuantityError(newQuantity, "Quantity must be a positive number. Use 'remove' to delete an item.");
        }

        const uow = this.unitOfWorkFactory.create();

        const cart = await this.cartFinder.findByUserId(userId);
        if (!cart) {
            throw new CartNotFoundError(userId);
        }

        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        const itemInCart = cart.items.find((item: CartItem) => item.product.id === productId);
        if (!itemInCart) {
            throw new ProductNotInCartError(productId);
        }

        const quantityDifference = newQuantity - itemInCart.quantity;

        if (product.stock < quantityDifference) {
            throw new Error(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
        }

        product.stock -= quantityDifference;
        itemInCart.quantity = newQuantity;

        uow.products.update(product);
        uow.carts.save(cart);

        await uow.commit();
    }
}