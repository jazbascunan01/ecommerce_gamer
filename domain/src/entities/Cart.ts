import { CartItem } from "./CartItem";

export class Cart {
    public items: CartItem[] = [];

    constructor(public userId: string) {} // cada carrito pertenece a un usuario

    addItem(item: CartItem) {
        const existing = this.items.find(i => i.product.id === item.product.id);
        if (existing) {
            const totalQuantity = existing.quantity + item.quantity;
            if (totalQuantity > item.product.stock) {
                throw new Error("Not enough stock for this product");
            }
            existing.quantity += item.quantity;
        } else {
            if (item.quantity > item.product.stock) {
                throw new Error("Not enough stock for this product");
            }
            this.items.push(item);
        }
    }

    removeItem(productId: string) {
        this.items = this.items.filter(i => i.product.id !== productId);
    }

    getTotal(): number {
        return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    }
}
