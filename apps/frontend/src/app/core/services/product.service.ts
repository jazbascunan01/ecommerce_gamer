import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductStats } from '../models/product.model';
import { IProductRepository } from '../repositories/product.repository';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private productRepository: IProductRepository) { }

  getProductById(productId: string): Observable<Product> {
    return this.productRepository.getProductById(productId);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.productRepository.deleteProduct(productId);
  }

  updateProduct(productId: string, productData: Partial<Product>): Observable<Product> {
    return this.productRepository.updateProduct(productId, productData);
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.productRepository.createProduct(productData);
  }

  getProductStats(): Observable<ProductStats> {
    return this.productRepository.getProductStats();
  }
}