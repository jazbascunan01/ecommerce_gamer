import { Cart } from "../entities/Cart";
import { ICartFinder } from "../services/IPersistence";

export class GetCart {
    constructor(private cartFinder: ICartFinder) {}

    async execute(userId: string): Promise<Cart | null> {
        return this.cartFinder.findOrCreateByUserId(userId);
    }
}