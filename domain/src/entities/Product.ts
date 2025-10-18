import { InsufficientStockError, InvalidEntityStateError } from "../errors/DomainError";
import { Entity } from "../core/Entity";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { UpdateProductData } from "../use-cases/product/UpdateProduct";

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del producto.
 *           example: 'clx123abc'
 *         name:
 *           type: string
 *           description: El nombre del producto.
 *           example: 'Teclado Mecánico RGB'
 *         description:
 *           type: string
 *           description: La descripción detallada del producto.
 *           example: 'Teclado mecánico con switches rojos, retroiluminación RGB personalizable.'
 *         price:
 *           type: number
 *           format: float
 *           description: El precio del producto.
 *           example: 89.99
 *         stock:
 *           type: integer
 *           description: La cantidad de stock disponible.
 *           example: 15
 *         imageUrl:
 *           type: string
 *           description: La URL de la imagen del producto.
 *           example: 'https://example.com/image.jpg'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: La fecha de creación del producto.
 */

interface ProductProps {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    createdAt: Date;
}

export class Product extends Entity<ProductProps> {
    private constructor(props: ProductProps, id?: UniqueEntityID) {
        super(props, id);

        if (this.price < 0) {
            throw new InvalidEntityStateError("Product price cannot be negative.");
        }
        if (this.stock < 0) {
            throw new InvalidEntityStateError("Product stock cannot be negative.");
        }
    }
    public static create(props: ProductProps, id?: UniqueEntityID): Product {
        const product = new Product(props, id);
        return product;
    }

    get name(): string { return this.props.name; }
    get description(): string { return this.props.description; }
    get price(): number { return this.props.price; }
    get stock(): number { return this.props.stock; }
    get imageUrl(): string { return this.props.imageUrl; }
    get createdAt(): Date { return this.props.createdAt; }
    get id(): UniqueEntityID {
        return this._id;
    }

    /**
     * Updates the product details from a data object.
     * Only updates fields that are provided and not undefined.
     */
    public updateDetails(data: UpdateProductData): void {
        if (data.name !== undefined) {
            this.props.name = data.name;
        }
        if (data.description !== undefined) {
            this.props.description = data.description;
        }
        if (data.price !== undefined) {
            if (data.price < 0) throw new InvalidEntityStateError("Product price cannot be negative.");
            this.props.price = data.price;
        }
        if (data.stock !== undefined) {
            if (data.stock < 0) throw new InvalidEntityStateError("Product stock cannot be negative.");
            this.props.stock = data.stock;
        }
        if (data.imageUrl !== undefined) {
            this.props.imageUrl = data.imageUrl;
        }
    }

    /**
     * Ajusta el stock del producto. Un número positivo lo incrementa, uno negativo lo disminuye.
     * @throws Error si el ajuste resulta en un stock negativo.
     */
    adjustStock(amount: number): void {
        const newStock = this.stock + amount;
        if (newStock < 0) {
            throw new InsufficientStockError(this._id.toString(), "Stock adjustment results in a negative value.");        }        this.props.stock += amount;
    }


    toJSON() {
        return {
            id: this.id.toString(),
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock,
            imageUrl: this.imageUrl,
            createdAt: this.createdAt,
        };
    }
}
