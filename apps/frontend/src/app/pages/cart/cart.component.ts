import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/state/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../core/models/cart-item.model';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import {CartItemComponent} from '../../shared/components/cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  isLoading$: Observable<boolean>;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
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

  onQuantityChange(event: { productId: string; quantity: number }): void {
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  onCheckout(): void {
    this.orderService.checkout();
  }
}
