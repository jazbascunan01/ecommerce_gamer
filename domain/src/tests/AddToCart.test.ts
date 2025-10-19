import { AddToCart } from "../use-cases";
import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { UniqueEntityID } from "../core/UniqueEntityID";
import {
    mockCartFinder,
    mockProductFinder,
    mockUowFactory,
    mockUnitOfWork,
    resetMocks
} from './_mocks';

beforeEach(() => {
    resetMocks();
});

describe("AddToCart", () => {
    it("should add a product to the cart and adjust stock", async () => {
        const userId = "user-1";
        const product = Product.create({ name: "Test Product", description: "desc", price: 10, stock: 5, imageUrl: 'url', createdAt: new Date() }, new UniqueEntityID("prod-1"));
        const cart = Cart.create({ userId: new UniqueEntityID(userId), items: [] });

        mockProductFinder.findProductById.mockResolvedValue(product);
        mockCartFinder.findOrCreateByUserId.mockResolvedValue(cart);

        const addToCart = new AddToCart(mockCartFinder, mockProductFinder, mockUowFactory);

        await addToCart.execute(userId, "prod-1", 1);

        expect(cart.items.length).toBe(1);
        expect(cart.items[0].product.name).toBe("Test Product");
        expect(product.stock).toBe(4); 
        expect(mockUnitOfWork.carts.save).toHaveBeenCalledWith(cart);
        expect(mockUnitOfWork.products.update).toHaveBeenCalledWith(product);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});