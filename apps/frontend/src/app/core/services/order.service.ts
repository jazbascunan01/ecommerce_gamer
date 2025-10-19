import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../state/cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  /**
   * Simula el proceso de checkout.
   * Limpia el carrito, muestra una alerta y redirige al usuario.
   */
  checkout(): void {
    this.cartService.clearCart();
    alert('¡Gracias por tu compra! Tu pedido ha sido procesado.');
    this.router.navigate(['/products']);
  }
}