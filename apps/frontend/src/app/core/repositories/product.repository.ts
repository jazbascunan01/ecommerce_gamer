import { Observable } from 'rxjs';
import { Product, ProductStats } from '../models/product.model';

export abstract class IProductRepository {
  abstract getAllProducts(): Observable<Product[]>;
  abstract getProductById(productId: string): Observable<Product>;
  abstract createProduct(productData: Partial<Product>): Observable<Product>;
  abstract updateProduct(
    productId: string,
    productData: Partial<Product>
  ): Observable<Product>;
  abstract deleteProduct(productId: string): Observable<void>;
  abstract getProductStats(): Observable<ProductStats>;
}