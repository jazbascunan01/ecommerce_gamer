import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class GetProductByIdUseCase {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  execute(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}