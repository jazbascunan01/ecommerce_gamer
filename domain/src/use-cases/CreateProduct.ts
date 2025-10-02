import { Product } from "../entities/Product";
import { IUnitOfWorkFactory } from "../services/IPersistence";
import * as crypto from "crypto";

export class CreateProduct {
    constructor(private unitOfWorkFactory: IUnitOfWorkFactory) {}

    async execute(name: string, description: string, price: number, stock: number): Promise<Product> {
        const product = new Product(
            crypto.randomUUID(),
            name,
            description,
            price,
            stock,
            new Date()
        );

        const uow = this.unitOfWorkFactory.create();
        uow.products.save(product);
        await uow.commit();

        return product;
    }
}