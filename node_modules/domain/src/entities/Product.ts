import { InsufficientStockError, InvalidEntityStateError } from "../errors/DomainError";

export class Product {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public price: number,
        public stock: number,
        public createdAt: Date
    ) {
        if (price < 0) {
            throw new InvalidEntityStateError("Product price cannot be negative.");
        }
        if (stock < 0) {
            throw new InvalidEntityStateError("Product stock cannot be negative.");
        }
    }

    /**
     * Ajusta el stock del producto. Un número positivo lo incrementa, uno negativo lo disminuye.
     * @throws Error si el ajuste resulta en un stock negativo.
     */
    adjustStock(amount: number): void {
        const newStock = this.stock + amount;
        if (newStock < 0) {
            throw new InsufficientStockError(this.id, "Stock adjustment results in a negative value.");
        }
        this.stock += amount;
    }

    /**
     * Decreases the stock of the product by a given amount.
     * @param amount The amount to decrease the stock by.
     */
    decreaseStock(amount: number): void {
        this.adjustStock(-amount);
    }
}
