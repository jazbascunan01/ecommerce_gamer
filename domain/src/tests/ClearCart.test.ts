import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { ClearCart } from "../use-cases";
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

describe("ClearCart", () => {
    it("should clear the cart and restore stock for all items", async () => {
        const userId = "user-1";
        const product1 = Product.create({ name: "P1", description: "d", price: 10, stock: 10, imageUrl: 'u', createdAt: new Date() }, new UniqueEntityID("p1"));
        const product2 = Product.create({ name: "P2", description: "d", price: 20, stock: 5, imageUrl: 'u', createdAt: new Date() }, new UniqueEntityID("p2"));
        const cart = Cart.create({ userId: new UniqueEntityID(userId), items: [] });
        cart.addItem(product1, 2);
        cart.addItem(product2, 1);

        mockCartFinder.findByUserId.mockResolvedValue(cart);
        mockProductFinder.findProductById.mockImplementation(id => {
            if (id === "p1") return Promise.resolve(product1);
            if (id === "p2") return Promise.resolve(product2);
            return Promise.resolve(null);
        });

        const clearCart = new ClearCart(mockCartFinder, mockProductFinder, mockUowFactory);

        await clearCart.execute(userId);

        expect(cart.items.length).toBe(0);
        expect(product1.stock).toBe(10);
        expect(product2.stock).toBe(5);
        expect(mockUnitOfWork.carts.save).toHaveBeenCalledWith(cart);
        expect(mockUnitOfWork.products.update).toHaveBeenCalledTimes(2);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});