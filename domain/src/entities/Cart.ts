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

    /**
     * Establece la cantidad para un producto dado.
     * Si la cantidad es 0, el producto se elimina del carrito.
     * Si el producto no existe, se añade.
     * Si el producto ya existe, se actualiza su cantidad.
     */
    setItemQuantity(product: Product, quantity: number) {
        if (quantity <= 0) {
            this.removeItem(product.id);
            return;
        }

        const existingItem = this.findItem(product.id);
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            this._items.push(new CartItem(product, quantity));
        }
    }

    getTotal(): number {
        return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    }
    clear(): void {
        this._items = [];
    }

    findItem(productId: string): CartItem | undefined {
        return this._items.find(item => item.product.id === productId);
    }

    removeItem(productId: string) {
        this._items = this._items.filter(i => i.product.id !== productId);
    }
}
