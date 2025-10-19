import {Cart} from "../entities/Cart";
import {Product} from "../entities/Product";
import {UniqueEntityID} from "../core/UniqueEntityID";
import {RemoveFromCart} from "../use-cases";
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

describe("RemoveFromCart", () => {
    it("should remove a product from the cart and restore stock", async () => {
        const userId = "user-1";
        const product = Product.create({
            name: "Test Product",
            description: "desc",
            price: 10,
            stock: 4,
            imageUrl: 'url',
            createdAt: new Date()
        }, new UniqueEntityID("prod-1"));
        const cart = Cart.create({userId: new UniqueEntityID(userId), items: []});
        cart.addItem(product, 1);

        mockProductFinder.findProductById.mockResolvedValue(product);
        mockCartFinder.findByUserId.mockResolvedValue(cart);

        const removeFromCart = new RemoveFromCart(mockCartFinder, mockProductFinder, mockUowFactory);

        await removeFromCart.execute(userId, "prod-1");

        expect(cart.items.length).toBe(0);
        expect(product.stock).toBe(4);
        expect(mockUnitOfWork.carts.save).toHaveBeenCalledWith(cart);
        expect(mockUnitOfWork.products.update).toHaveBeenCalledWith(product);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});