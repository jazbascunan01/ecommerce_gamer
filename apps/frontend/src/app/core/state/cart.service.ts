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
  // La URL base de la API. Las rutas del carrito están anidadas bajo /api/users
  private apiUrl = 'http://localhost:3000/api/users/cart';

  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  // Exponemos el estado del carrito como un Observable de solo lectura.
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Observable para la cantidad total de ítems en el carrito (para el ícono del header).
  public totalItems$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((total, item) => total + item.quantity, 0))
  );

  // Observable para el precio total del carrito.
  public totalPrice$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((total, item) => total + (item.product.price * item.quantity), 0))
  );

  constructor(private http: HttpClient, private authService: AuthService) {
    // Nos suscribimos a los cambios en el estado de autenticación.
    this.authService.user$.subscribe(user => {
      if (user) {
        // Si hay un usuario, cargamos su carrito.
        this.loadInitialCart();
      } else {
        // Si no hay usuario (o cierra sesión), vaciamos el carrito localmente.
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
        // Si falla (p.ej. usuario no logueado), nos aseguramos que el carrito esté vacío.
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
    // Ahora, en lugar de la lógica local, hacemos una petición al backend.
    // Asumo un endpoint POST en /api/cart/add que recibe el productId.
    const payload = { productId: product.id, quantity: 1 };
    this.loadingSubject.next(true);
    // La respuesta es un mensaje, no el carrito. Por eso usamos <any>.
    this.http.post<any>(`${this.apiUrl}/items`, payload).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => this.loadInitialCart(), // En éxito, recargamos el carrito.
      error: err => {
        console.error('Error al añadir producto al carrito:', err);
        // Aquí podrías mostrar una notificación al usuario
      }
    });
  }

  /**
   * Elimina un producto del carrito por su ID.
   */
  removeProduct(productId: string): void {
    // Asumo un endpoint DELETE en /api/cart/items/{productId}
    this.loadingSubject.next(true);
    this.http.delete<any>(`${this.apiUrl}/items/${productId}`).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => this.loadInitialCart(), // En éxito, recargamos el carrito.
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
    // La lógica de si la cantidad es <= 0 ahora la debe manejar el backend.
    // Asumo un endpoint PUT o PATCH en /api/cart/items/{productId}
    const payload = { quantity };
    this.loadingSubject.next(true);
    this.http.patch<any>(`${this.apiUrl}/items/${productId}`, payload).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe({
      next: () => this.loadInitialCart(), // En éxito, recargamos el carrito.
      error: err => {
        console.error('Error al actualizar la cantidad del producto:', err);
      }
    });
  }
}
