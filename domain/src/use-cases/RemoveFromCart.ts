import { Cart } from "../entities/Cart";

export class RemoveFromCart {
    constructor(private cart: Cart) {}

    execute(productId: string) {
        this.cart.removeItem(productId);
    }
}
