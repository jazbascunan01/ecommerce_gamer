import { CartItem } from "../entities/CartItem";
import { ICartFinder, IProductFinder, IUnitOfWorkFactory } from "../services/IPersistence";
import { InsufficientStockError, InvalidQuantityError, ProductNotFoundError } from "../errors/DomainError";

export class AddToCart {
    constructor(
        private cartFinder: ICartFinder,
        private productFinder: IProductFinder,
        private unitOfWorkFactory: IUnitOfWorkFactory
    ) {}

    async execute(userId: string, productId: string, quantity: number): Promise<void> {
        // 0. Lógica de negocio: Validar la entrada
        if (quantity <= 0) {
            throw new InvalidQuantityError(quantity);
        }

        // 1. Lógica de negocio: Validar producto y stock
        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }
        if (product.stock < quantity) {
            throw new InsufficientStockError(productId);
        }

        // 2. Obtener el carrito
        const cart = await this.cartFinder.findOrCreateByUserId(userId);

        // 3. Lógica de negocio: Modificar entidades
        cart.setItemQuantity(product, quantity);        product.stock -= quantity;

        // 4. Registrar los cambios en una Unidad de Trabajo
        const uow = this.unitOfWorkFactory.create();
        uow.products.update(product);
        uow.carts.save(cart);

        // 5. Confirmar todos los cambios en una única transacción atómica
        await uow.commit();
    }
}
