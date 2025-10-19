import { Entity } from "../core/Entity";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { CartItem } from "./CartItem";
import { Product } from "./Product";

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: El ID único del carrito.
 *         userId:
 *           type: string
 *           description: El ID del usuario al que pertenece el carrito.
 *         items:
 *           type: array
 *           description: La lista de ítems en el carrito.
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         total:
 *           type: number
 *           description: El precio total de todos los ítems en el carrito.
 */

interface CartProps {
    items: CartItem[];
    userId: UniqueEntityID;
    total?: number;
}

export class Cart extends Entity<CartProps> {
    private constructor(props: CartProps, id?: UniqueEntityID) {
        super(
            {
                ...props,
                total: props.total ?? 0,
                items: props.items ?? [],
            },
            id,
        );
    }

    public static create(props: CartProps, id?: UniqueEntityID): Cart {
        const cart = new Cart(props, id);
        cart.recalculateTotal();
        return cart;
    }

    get items(): CartItem[] {
        return this.props.items;
    }

    get userId(): UniqueEntityID {
        return this.props.userId;
    }

    get total(): number {
        return this.props.total!;
    }

    get id(): UniqueEntityID {
        return this._id;
    }

    private recalculateTotal(): void {
        this.props.total = this.items.reduce((total, item) => total + item.price, 0);
    }

    public addItem(product: Product, quantity: number): void {
        if (product.stock <= 0) {
            return;
        }

        const existingItem = this.items.find((item) =>
            item.product.id.equals(product.id),
        );

        if (existingItem) {
            existingItem.increaseQuantity(quantity);
        } else {
            const newItem = CartItem.create({
                product,
                quantity: quantity,            });
            this.props.items.push(newItem);
        }

        product.adjustStock(-quantity);
        this.recalculateTotal();
    }

    /**
     * Removes all items from the cart.
     */
    public clear(): void {
        this.props.items = [];
        this.recalculateTotal();
    }
    /**
     * Removes an item from the cart by product ID.
     * @param productId The ID of the product to remove.
     */
    public removeItem(productId: string): void {
        this.props.items = this.props.items.filter(
            (item) => item.product.id.toString() !== productId
        );
        this.recalculateTotal();
    }
    /**
     * Finds a cart item by its product ID.
     * @param productId The ID of the product to find.
     * @returns The CartItem if found, otherwise undefined.
     */
    public findItem(productId: string): CartItem | undefined {
        return this.props.items.find(
            (item) => item.product.id.toString() === productId
        );
    }

    /**
     * Sets the quantity for a specific item in the cart.
     * If the quantity is 0 or less, the item is removed.
     * @param productId The ID of the product to update.
     * @param newQuantity The new quantity for the item.
     */
    public setItemQuantity(productId: string, newQuantity: number): void {
        const itemToUpdate = this.findItem(productId);

        if (itemToUpdate) {
            itemToUpdate.setQuantity(newQuantity);
            this.recalculateTotal();
        }
    }

    toJSON() {
        return {
            id: this.id.toString(),
            userId: this.userId.toString(),
            items: this.items.map(item => item.toJSON()),
            total: this.total,
        };
    }
}
