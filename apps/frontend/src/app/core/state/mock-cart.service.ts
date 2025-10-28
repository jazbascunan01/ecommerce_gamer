import { of, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

export class MockCartService {
  public items$: Observable<CartItem[]> = of([]);
  public cart$: Observable<CartItem[]> = of([]);
  public itemAdded$: Observable<boolean> = of(false);
  public loading$: Observable<boolean> = of(false);
  public totalItems$: Observable<number> = of(0);
  public totalPrice$: Observable<number> = of(0);

  public loadInitialCart(): void {
  }

  public addProduct(_product: Product): void {
  }

  public removeProduct(_productId: string): void {
  }

  public updateQuantity(_productId: string, _quantity: number): void {
  }

  public clearCart(): void {
  }

  public getCart(): Observable<CartItem[]> {
    return of([]);
  }
}
