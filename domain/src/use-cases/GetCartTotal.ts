import { Cart } from "../entities/Cart";

export class GetCartTotal {
    constructor(private cart: Cart) {}

    execute(): number {
        return this.cart.getTotal();
    }
}
