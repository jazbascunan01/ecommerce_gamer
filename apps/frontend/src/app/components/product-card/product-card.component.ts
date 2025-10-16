import { Component, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/state/cart.service';
import { AuthService } from '../../core/auth/auth.service';
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

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  onAddToCart(): void {
    this.cartService.addProduct(this.product);
  }
}
