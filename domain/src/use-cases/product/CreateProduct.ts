import { Product } from "../../entities/Product";
import { IUnitOfWorkFactory } from "../../services/IPersistence";

export class CreateProduct {
    constructor(private unitOfWorkFactory: IUnitOfWorkFactory) {}

    async execute(name: string, description: string, price: number, stock: number, imageUrl: string): Promise<Product> {
        const product = Product.create({
            name,
            description,
            price,
            stock,
            imageUrl,
            createdAt: new Date()
        });

        const uow = this.unitOfWorkFactory.create();
        uow.products.save(product);
        await uow.commit();

        return product;
    }
}