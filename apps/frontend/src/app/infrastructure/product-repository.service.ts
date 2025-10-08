import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductRepository {
  // La URL de tu API de backend
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {
  }

  getAllProducts(): Observable<Product[]> {
    // Hacemos la llamada GET y esperamos un array de tipo Product
    return this.http.get<Product[]>(this.apiUrl);
  }
}
