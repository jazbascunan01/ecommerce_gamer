import { CartItem } from "../entities/CartItem";
import { ICartPersistence, IProductFinder, IProductPersistence } from "../services/IPersistence";

export class AddToCart {
    constructor(
        private cartPersistence: ICartPersistence,
        private productFinder: IProductFinder,
        private productPersistence: IProductPersistence
    ) {}

    async execute(userId: string, productId: string, quantity: number): Promise<void> {
        // 1. Lógica de negocio: Validar producto y stock
        const product = await this.productFinder.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < quantity) {
            throw new Error("Not enough stock");
        }

        // 2. Obtener el carrito
        const cart = await this.cartPersistence.findOrCreateByUserId(userId);

        // 3. Lógica de negocio: Modificar entidades
        cart.addItem(new CartItem(product, quantity));
        product.stock -= quantity;

        // 4. Persistir los cambios
        await this.productPersistence.update(product);
        await this.cartPersistence.save(cart);
    }
}
