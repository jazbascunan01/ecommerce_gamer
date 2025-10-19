import { Product } from "./Product";
import { Entity } from "../core/Entity";
import { UniqueEntityID } from "../core/UniqueEntityID";

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del ítem del carrito.
 *         quantity:
 *           type: integer
 *           description: La cantidad del producto en el carrito.
 *           example: 2
 *         product:
 *           $ref: '#/components/schemas/Product'
 */

interface CartItemProps {
    product: Product;
    quantity: number;
}

export class CartItem extends Entity<CartItemProps> {
    private constructor(props: CartItemProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: CartItemProps, id?: UniqueEntityID): CartItem {
        return new CartItem(props, id);
    }

    get product(): Product {
        return this.props.product;
    }

    get quantity(): number {
        return this.props.quantity;
    }

    public increaseQuantity(amount = 1): void {
        this.props.quantity += amount;
    }

    get price(): number {
        return this.props.product.price * this.props.quantity;
    }
    public setQuantity(quantity: number): void {
        this.props.quantity = quantity;
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    toJSON() {
        return {
            id: this.id.toString(),
            quantity: this.quantity,
            product: this.product.toJSON(),
        };
    }
}
