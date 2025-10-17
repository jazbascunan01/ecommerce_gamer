import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../core/models/product.model';
import { ProductRepository } from '../infrastructure/product-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ListProductsUseCase {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private productRepository: ProductRepository) {
    this.refresh();
  }

  execute(): Observable<Product[]> {
    return this.products$;
  }

  public refresh(): void {
    this.productRepository.getAllProducts().pipe(
      tap(products => this.productsSubject.next(products))
    ).subscribe();
  }
}
