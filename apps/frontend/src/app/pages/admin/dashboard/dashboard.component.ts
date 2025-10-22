import {Component} from '@angular/core';

import {CommonModule, CurrencyPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {ProductService} from '../../../core/services/product.service';
import {ProductStats} from '../../../core/models/product.model';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, StatCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  stats$!: Observable<ProductStats>;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.stats$ = this.productService.getProductStats();
  }
}
