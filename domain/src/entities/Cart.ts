import { CartItem } from "./CartItem";
import {Product} from "./Product";

export class Cart {
    private _items: CartItem[] = [];
    public readonly id: string; // El ID del carrito, inmutable

    constructor(id: string, public readonly userId: string, initialItems: CartItem[] = []) {
        this.id = id;
        this._items = initialItems;
    }

    get items(): readonly CartItem[] {
        return this._items; // Devuelve una vista de solo lectura del array
    }

    addItem(product: Product, quantity: number) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this._items.push(new CartItem(product, quantity));
        }
    }

    removeItem(productId: string) {
        this._items = this._items.filter(i => i.product.id !== productId);
    }

    getTotal(): number {
        return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    }
    clear(): void {
        this._items = [];
    }
}
