import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../core/models/product.model';
import { IProductRepository } from '../core/repositories/product.repository';

@Injectable({
  providedIn: 'root'
})
export class ListProductsUseCase {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private productRepository: IProductRepository) {
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
