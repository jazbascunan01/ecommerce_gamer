import { CartItem } from "./CartItem";

export class Cart {
    public items: CartItem[] = [];

    addItem(item: CartItem) {
        const existing = this.items.find(i => i.product.id === item.product.id);
        if (existing) {
            existing.quantity += item.quantity;
        } else {
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
