import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { CartNotFoundError, ProductNotFoundError } from "../errors/DomainError";
import { ICartFinder, IProductFinder, IUnitOfWork, IUnitOfWorkFactory } from "../services/IPersistence";

export class AddToCart {
    private readonly cartFinder: ICartFinder;
    private readonly productFinder: IProductFinder;
    private readonly unitOfWorkFactory: IUnitOfWorkFactory;

    constructor(
        cartFinder: ICartFinder,
        productFinder: IProductFinder,
        unitOfWorkFactory: IUnitOfWorkFactory,
    ) {
        this.cartFinder = cartFinder;
        this.productFinder = productFinder;
        this.unitOfWorkFactory = unitOfWorkFactory;
    }

    async execute(userId: string, productId: string, quantity: number): Promise<void> {
        const uow = this.unitOfWorkFactory.create();

        const cart = await this.cartFinder.findOrCreateByUserId(userId);
        if (!cart) {
            throw new CartNotFoundError(userId);
        }

        const product = await this.productFinder.findProductById(productId);
        if (!product) {
            throw new ProductNotFoundError(productId);
        }

        cart.addItem(product, quantity);

        uow.carts.save(cart);
        uow.products.update(product);

        await uow.commit();
    }
}
