import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../core/models/product.model';
import { ProductRepository } from '../infrastructure/product-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ListProductsUseCase {
  // Inyectamos el repositorio (la capa de infraestructura)
  constructor(private productRepository: ProductRepository) { }

  // El caso de uso simplemente expone un método "execute" que orquesta la lógica.
  execute(): Observable<Product[]> {
    return this.productRepository.getAllProducts();
  }
}