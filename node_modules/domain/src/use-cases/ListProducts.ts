import { Product } from "../entities/Product";

export class ListProducts {
    constructor(private products: Product[]) {}

    execute(): Product[] {
        return [...this.products]; // devuelve un nuevo array para no exponer el original
    }
}
