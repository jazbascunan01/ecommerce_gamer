import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { DashboardComponent } from './dashboard.component';
import { IProductRepository } from '../../../core/repositories/product.repository';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let productRepositoryMock: Partial<IProductRepository>;

  beforeEach(async () => {
    productRepositoryMock = {
      getProductStats: () =>
        of({
          totalProducts: 0,
          totalStock: 0,
          totalStockValue: 0,
          productsOutOfStock: 0,
          averageProductPrice: 0,
          highestStockProduct: null,
        }),
      getAllProducts: () => of([]),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        { provide: IProductRepository, useValue: productRepositoryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
