import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";

export interface IProductFinder {
    findById(id: string): Promise<Product | null>;
}

export interface ICartPersistence {
    findOrCreateByUserId(userId: string): Promise<Cart>;
    save(cart: Cart): Promise<void>;
}

export interface IProductPersistence {
    update(product: Product): Promise<void>;
}