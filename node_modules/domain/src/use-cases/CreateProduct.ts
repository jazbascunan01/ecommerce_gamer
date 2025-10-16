import { Product } from "../entities/Product";
import { IUnitOfWorkFactory } from "../services/IPersistence";

export class CreateProduct {
    constructor(private unitOfWorkFactory: IUnitOfWorkFactory) {}

    async execute(name: string, description: string, price: number, stock: number, imageUrl: string): Promise<Product> {
        // Usamos el método estático 'create' para instanciar la entidad,
        // pasándole las propiedades en un objeto.
        // El ID se genera automáticamente dentro de la entidad si no se proporciona.
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