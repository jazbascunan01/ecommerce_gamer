import { CartFinder } from "../services/CartFinder";
import { ProductFinder } from "../services/ProductFinder";
import { UnitOfWork, UnitOfWorkFactory } from "../services/UnitOfWork";

export class AddToCart {
    private readonly unitOfWork: UnitOfWork;
    private readonly cartFinder: CartFinder;
    private readonly productFinder: ProductFinder;

    constructor(
        cartFinder: CartFinder,
        productFinder: ProductFinder,
        unitOfWorkFactory: UnitOfWorkFactory,
    ) {
        this.unitOfWork = unitOfWorkFactory.create();
        this.cartFinder = cartFinder;
        this.productFinder = productFinder;
    }

    async execute(userId: string, productId: string): Promise<void> {
        const cart = await this.cartFinder.find(userId);
        const product = await this.productFinder.find(productId);

        // The business logic is now fully encapsulated in the Cart entity.
        // The use case just orchestrates the operation.
        cart.addItem(product);

        await this.unitOfWork.cartRepository.save(cart);
        await this.unitOfWork.productRepository.save(product);

        return this.unitOfWork.commit();
    }
}
