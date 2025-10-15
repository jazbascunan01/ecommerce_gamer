import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/state/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../core/models/cart-item.model';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  isLoading$: Observable<boolean>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.items$;
    this.totalPrice$ = this.cartService.totalPrice$;
    this.isLoading$ = this.cartService.loading$;
  }

  ngOnInit(): void {
    this.cartService.loadInitialCart();
  }

  onRemoveProduct(productId: string): void {
    this.cartService.removeProduct(productId);
  }

  onQuantityChange(productId: string, newQuantity: string): void {
    const quantity = parseInt(newQuantity, 10);
    // Nos aseguramos de que el valor sea un número válido antes de enviarlo
    if (!isNaN(quantity)) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }
}
