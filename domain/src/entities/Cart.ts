import { Entity } from "../core/Entity";
import { UniqueEntityID } from "../core/UniqueEntityID";
import { CartItem } from "./CartItem";
import { Product } from "./Product";

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
        cart.recalculateTotal(); // Recalculate total on creation
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

    private recalculateTotal(): void {
        this.props.total = this.items.reduce((total, item) => total + item.price, 0);
    }

    public addItem(product: Product): void {
        // 1. Check for stock
        if (product.stock <= 0) {
            // No stock, do nothing.
            return;
        }

        const existingItem = this.items.find((item) =>
            item.product.id.equals(product.id),
        );

        if (existingItem) {
            // 3. If it exists, increase quantity
            existingItem.increaseQuantity();
        } else {
            // 4. If it's new, create and add it
            const newItem = CartItem.create({
                product,
                quantity: 1,
            });
            this.props.items.push(newItem);
        }

        // 5. In both cases, decrease product stock
        product.decreaseStock(1);

        // 6. Recalculate total price
        this.recalculateTotal();
    }
}
