import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductListComponent } from './product-list.component';
import { IProductRepository } from '../../core/repositories/product.repository';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productRepositoryMock: Partial<IProductRepository>;

  beforeEach(async () => {
    productRepositoryMock = {
      getAllProducts: () => of([]),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideHttpClient(),
        { provide: IProductRepository, useValue: productRepositoryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
