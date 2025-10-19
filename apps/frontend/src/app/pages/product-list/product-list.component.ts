import { Component } from '@angular/core';import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';
import { ListProductsUseCase } from '../../application/list-products.service';
import { AuthService } from '../../core/auth/auth.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],})
export class ProductListComponent {
  products$: Observable<Product[]>;
  isAdmin$: Observable<boolean>;
  constructor(
    private listProductsUseCase: ListProductsUseCase,
    private authService: AuthService
  ) {
    this.products$ = this.listProductsUseCase.products$;
    this.isAdmin$ = this.authService.isAdmin$;
  }

}
