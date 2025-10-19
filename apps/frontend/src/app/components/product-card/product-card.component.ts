import { Component, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/state/cart.service';
import { AuthService } from '../../core/auth/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ListProductsUseCase } from '../../application/list-products.service';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  user$: Observable<User | null>;
  isAdmin$: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService,
    private listProductsUseCase: ListProductsUseCase
  ) {
    this.user$ = this.authService.user$;
    this.isAdmin$ = this.authService.isAdmin$;
  }

  onAddToCart(): void {
    this.cartService.addProduct(this.product);
  }

  onDeleteProduct(): void {
    if (!this.product || !this.product.id) return;

    if (confirm(`¿Estás seguro de que quieres eliminar "${this.product.name}"?`)) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          console.log('Producto eliminado con éxito');
          this.listProductsUseCase.refresh();
        },
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          alert('Hubo un error al eliminar el producto.');
        }
      });
    }
  }
}
