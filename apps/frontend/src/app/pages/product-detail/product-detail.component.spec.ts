import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/state/cart.service';
import { MockCartService } from '../../core/state/mock-cart.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 100,
    description: 'Test Description',
    stock: 10,
    imageUrl: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
            paramMap: of(convertToParamMap({ id: '1' })),
            snapshot: { paramMap: convertToParamMap({ id: '1' }) },
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProductById: (_id: string) => of(testProduct),
          },
        },
        { provide: CartService, useClass: MockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
