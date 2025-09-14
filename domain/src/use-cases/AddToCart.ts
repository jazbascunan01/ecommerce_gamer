import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";

export class AddToCart {
    constructor(private cart: Cart) {}

    execute(product: Product, quantity: number) {
        this.cart.addItem({ product, quantity });
    }
}
