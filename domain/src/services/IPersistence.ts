import { Cart } from "../entities/Cart";
import { Product } from "../entities/Product";
import { User } from "../entities/User";

export interface IProductFinder {
    findProductById(id: string): Promise<Product | null>;
    findAllProducts(): Promise<Product[]>;
}

export interface IUserFinder {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}

export interface IUnitOfWork {
    // Métodos para registrar cambios en las entidades
    users: { save(user: User): Promise<User> };
    products: {
        save: (product: Product) => void;
        update: (product: Product) => void;
        delete: (product: Product) => void;
    };
    carts: { save(cart: Cart): void };
    // Método para confirmar todos los cambios en una sola transacción
    commit(): Promise<void>;
}

export interface IUnitOfWorkFactory {
    create(): IUnitOfWork;
}

export interface ICartFinder {
    findOrCreateByUserId(userId: string): Promise<Cart>;
    findByUserId(userId: string): Promise<Cart | null>;
}