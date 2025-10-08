import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ListProductsUseCase } from '../../application/list-products.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],})
export class ProductListComponent implements OnInit {
  // Guardamos el observable que nos devuelve el caso de uso
  products$!: Observable<Product[]>;

  // Inyectamos nuestro caso de uso
  constructor(private listProducts: ListProductsUseCase) {}

  ngOnInit(): void {
    this.products$ = this.listProducts.execute();
  }
}
