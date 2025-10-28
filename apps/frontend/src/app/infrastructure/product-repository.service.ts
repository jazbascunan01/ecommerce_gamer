import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductStats } from '../core/models/product.model';
import { IProductRepository } from '../core/repositories/product.repository';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrismaProductRepository implements IProductRepository {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }

  createProduct(productData: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, productData);
  }

  updateProduct(productId: string, productData: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, productData);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }

  getProductStats(): Observable<ProductStats> {
    return this.http.get<ProductStats>(`${this.apiUrl}/summary/stats`);
  }
}
