import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { AddToCart } from "../use-cases/AddToCart";
import { RemoveFromCart } from "../use-cases/RemoveFromCart";
import { GetCartTotal } from "../use-cases/GetCartTotal";
import * as crypto from "crypto";

describe("Cart", () => {
    let cart: Cart;
    let addToCart: AddToCart;
    let removeFromCart: RemoveFromCart;
    let getCartTotal: GetCartTotal;
    let product1: Product;
    let product2: Product;

    beforeEach(() => {
        cart = new Cart();
        addToCart = new AddToCart(cart);
        removeFromCart = new RemoveFromCart(cart);
        getCartTotal = new GetCartTotal(cart);

        product1 = new Product(crypto.randomUUID(), "Mouse Gamer", "RGB", 5000, 10, new Date());
        product2 = new Product(crypto.randomUUID(), "Teclado", "Mecánico", 8000, 5, new Date());
    });

    it("should add items to cart", () => {
        addToCart.execute(product1, 2);
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].quantity).toBe(2);
    });

    it("should remove items from cart", () => {
        addToCart.execute(product1, 1);
        removeFromCart.execute(product1.id);
        expect(cart.items.length).toBe(0);
    });

    it("should calculate total correctly", () => {
        addToCart.execute(product1, 2); // 5000 * 2
        addToCart.execute(product2, 1); // 8000 * 1
        const total = getCartTotal.execute();
        expect(total).toBe(18000);
    });
});
