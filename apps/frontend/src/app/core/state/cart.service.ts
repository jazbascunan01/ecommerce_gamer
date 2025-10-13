import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, finalize } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { AuthService } from '../auth/auth.service';
import { ListProductsUseCase } from '../../application/list-products.service'; // 1. Importamos el caso de uso

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  public totalItems$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  public totalPrice$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
  );

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private listProductsUseCase: ListProductsUseCase // 2. Inyectamos el caso de uso
  ) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadInitialCart();
      } else {
        this.itemsSubject.next([]);
      }
    });
  }

  private loadInitialCart(): void {
    this.loadingSubject.next(true);
    this.http.get<CartItem[]>(`${this.apiUrl}`).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: items => this.itemsSubject.next(items),
      error: err => {
        console.error('Error al cargar el carrito inicial:', err);
        this.itemsSubject.next([]);
      }
    });
  }

  addProduct(product: Product): void {
    const payload = { productId: product.id, quantity: 1 };
    this.loadingSubject.next(true);
    this.http.post<any>(`${this.apiUrl}/items`, payload).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => {
        this.loadInitialCart(); // Recargamos el carrito
        this.listProductsUseCase.refresh(); // 3. ¡Recargamos la lista de productos!
      },
      error: err => {
        console.error('Error al añadir producto al carrito:', err);
      }
    });
  }

  removeProduct(productId: string): void {
    this.loadingSubject.next(true);
    this.http.delete<any>(`${this.apiUrl}/items/${productId}`).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => {
        this.loadInitialCart();
        this.listProductsUseCase.refresh(); // Hacemos lo mismo al eliminar
      },
      error: err => {
        console.error('Error al eliminar producto del carrito:', err);
      }
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    const payload = { quantity };
    this.loadingSubject.next(true);
    this.http.patch<any>(`${this.apiUrl}/items/${productId}`, payload).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => {
        this.loadInitialCart();
        this.listProductsUseCase.refresh(); // Y también al actualizar
      },
      error: err => {
        console.error('Error al actualizar la cantidad del producto:', err);
      }
    });
  }
}
