import {Cart} from "../entities/Cart";
import {Product} from "../entities/Product";
import {UniqueEntityID} from "../core/UniqueEntityID";
import {UpdateCartItem} from "../use-cases";
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

describe("UpdateCartItem", () => {
    it("should update a cart item's quantity and adjust stock", async () => {
        const userId = "user-1";
        const product = Product.create({
            name: "Test Product",
            description: "desc",
            price: 10,
            stock: 5,
            imageUrl: 'url',
            createdAt: new Date()
        }, new UniqueEntityID("prod-1"));
        const cart = Cart.create({userId: new UniqueEntityID(userId), items: []});
        cart.addItem(product, 1);
        mockProductFinder.findProductById.mockResolvedValue(product);
        mockCartFinder.findByUserId.mockResolvedValue(cart);
        const updateCartItem = new UpdateCartItem(mockCartFinder, mockProductFinder, mockUowFactory);
        await updateCartItem.execute(userId, "prod-1", 3);
        expect(cart.items[0].quantity).toBe(3);
        expect(product.stock).toBe(2);
        expect(mockUnitOfWork.carts.save).toHaveBeenCalledWith(cart);
        expect(mockUnitOfWork.products.update).toHaveBeenCalledWith(product);
        expect(mockUnitOfWork.commit).toHaveBeenCalledTimes(1);
    });
});