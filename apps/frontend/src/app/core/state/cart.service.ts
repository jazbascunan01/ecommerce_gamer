import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, finalize } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { AuthService } from '../auth/auth.service';

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

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadInitialCart();
      } else {
        this.itemsSubject.next([]);
      }
    });
  }

  /**
   * Carga el estado inicial del carrito desde el backend.
   */
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

  /**
   * Añade un producto al carrito.
   * Si el producto ya existe, incrementa su cantidad.
   * Si no, lo añade como un nuevo ítem.
   */
  addProduct(product: Product): void {
    const payload = { productId: product.id, quantity: 1 };
    this.loadingSubject.next(true);
    this.http.post<any>(`${this.apiUrl}/items`, payload).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => this.loadInitialCart(),
      error: err => {
        console.error('Error al añadir producto al carrito:', err);
      }
    });
  }

  /**
   * Elimina un producto del carrito por su ID.
   */
  removeProduct(productId: string): void {
    this.loadingSubject.next(true);
    this.http.delete<any>(`${this.apiUrl}/items/${productId}`).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => this.loadInitialCart(),
      error: err => {
        console.error('Error al eliminar producto del carrito:', err);
      }
    });
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * Si la cantidad es 0 o menos, elimina el producto.
   * @param productId El ID del producto a actualizar.
   * @param quantity La nueva cantidad.
   */
  updateQuantity(productId: string, quantity: number): void {
    const payload = { quantity };
    this.loadingSubject.next(true);
    this.http.patch<any>(`${this.apiUrl}/items/${productId}`, payload).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => this.loadInitialCart(),
      error: err => {
        console.error('Error al actualizar la cantidad del producto:', err);
      }
    });
  }
}
