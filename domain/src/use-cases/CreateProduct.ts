import { Product } from "../entities/Product";
import * as crypto from "crypto";

export class CreateProduct {
    constructor(private products: Product[]) {}

    execute(name: string, description: string, price: number, stock: number): Product {
        const product = new Product(
            crypto.randomUUID(),
            name,
            description,
            price,
            stock,
            new Date()
        );
        this.products.push(product);
        return product;
    }
}
