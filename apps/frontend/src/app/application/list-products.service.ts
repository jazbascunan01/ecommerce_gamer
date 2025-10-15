import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../core/models/product.model';
import { ProductRepository } from '../infrastructure/product-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ListProductsUseCase {
  // 1. Usamos un BehaviorSubject para "recordar" la lista de productos.
  private productsSubject = new BehaviorSubject<Product[]>([]);

  // 2. Exponemos la lista como un Observable para que los componentes se suscriban.
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private productRepository: ProductRepository) {
    // 3. Cargamos los productos iniciales cuando se crea el servicio.
    this.refresh();
  }

  // 4. El método execute ahora devuelve el observable del estado actual.
  execute(): Observable<Product[]> {
    return this.products$;
  }

  // 5. ¡El método clave! Permite forzar la recarga de productos.
  public refresh(): void {
    this.productRepository.getAllProducts().pipe(
      tap(products => this.productsSubject.next(products))
    ).subscribe(); // Nos suscribimos aquí para que la llamada se ejecute.
  }
}
