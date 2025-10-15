import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { GetProductByIdUseCase } from '../../application/get-product-by-id.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/state/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']

})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product | null>;

  // Inyección de dependencias moderna con inject()
  private route = inject(ActivatedRoute);
  private getProductById = inject(GetProductByIdUseCase);
  private cartService = inject(CartService);

  ngOnInit(): void {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.getProductById.execute(id).pipe(
            catchError(error => {
              console.error('Error fetching product:', error);
              // En caso de error (ej. producto no encontrado), devolvemos un observable con null
              return of(null);
            })
          );
        }
        return of(null); // Si no hay ID, devolvemos un observable con null
      })
    );
  }

  onAddToCart(product: Product): void {
    if (product) {
      this.cartService.addProduct(product);
    }
  }
}
