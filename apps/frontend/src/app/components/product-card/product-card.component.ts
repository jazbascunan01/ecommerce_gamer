import { Component, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { RouterLink } from '@angular/router';
import {CommonModule, CurrencyPipe} from '@angular/common';
import { CartService } from '../../core/state/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
  constructor(private cartService: CartService) {}

  onAddToCart(): void {
    this.cartService.addProduct(this.product);
  }
}
