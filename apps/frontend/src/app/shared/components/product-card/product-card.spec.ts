import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductCardComponent } from './product-card.component';
import { provideRouter } from '@angular/router';
import { IProductRepository } from '../../../core/repositories/product.repository';
import { of } from 'rxjs';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let productRepositoryMock: Partial<IProductRepository>;

  beforeEach(async () => {
    productRepositoryMock = {
      getAllProducts: () => of([]),
    };

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: IProductRepository, useValue: productRepositoryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      description: 'Test Description',
      imageUrl: 'test.jpg',
      stock: 10,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
