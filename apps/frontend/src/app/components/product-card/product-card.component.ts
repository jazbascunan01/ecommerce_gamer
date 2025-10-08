import { Component, Input } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;
}
