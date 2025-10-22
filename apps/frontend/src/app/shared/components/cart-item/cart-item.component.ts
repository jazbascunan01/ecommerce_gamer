import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../../core/models/cart-item.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Input() isLoading = false;

  @Output() remove = new EventEmitter<string>();
  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();

  onQuantityChange(newQuantity: string): void {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.quantityChange.emit({ productId: this.item.product.id, quantity });
    }
  }

  onRemove(): void {
    this.remove.emit(this.item.product.id);
  }
}