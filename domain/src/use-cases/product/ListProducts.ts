import { Product } from "../../entities/Product";
import { IProductFinder } from "../../services/IPersistence";

export class ListProducts {
    constructor(private productFinder: IProductFinder) {}

    async execute(): Promise<Product[]> {
        return this.productFinder.findAllProducts();
    }
}