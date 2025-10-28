import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { AuthService } from '../auth/auth.service';
import { ListProductsUseCase } from '../../application/list-products.service';
import { of } from 'rxjs';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceMock: Partial<AuthService>;
  let listProductsUseCaseMock: Partial<ListProductsUseCase>;

  beforeEach(() => {
    authServiceMock = {
      user$: of(null)
    };
    listProductsUseCaseMock = {
      refresh: jasmine.createSpy('refresh')
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: ListProductsUseCase, useValue: listProductsUseCaseMock }
      ],
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#addProduct', () => {
    it('should add a new product to the cart via HTTP POST and then reload the cart', () => {
      const newProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        description: 'A product for testing',
        stock: 10,
        imageUrl: 'url.jpg',
      };

      service.addProduct(newProduct);

      const addReq = httpMock.expectOne(`${service['apiUrl']}/items`);
      expect(addReq.request.method).toBe('POST');
      expect(addReq.request.body).toEqual({ productId: 'prod-1', quantity: 1 });
      addReq.flush({});

      const loadReq = httpMock.expectOne(service['apiUrl']);
      expect(loadReq.request.method).toBe('GET');
      loadReq.flush({ items: [{ product: newProduct, quantity: 1 }] });
    });

    it('should update quantity via HTTP PATCH if product is already in cart', () => {
      const existingProduct: Product = {
        id: 'prod-1',
        name: 'Test Product',
        price: 100,
        description: 'A product for testing',
        stock: 10,
        imageUrl: 'url.jpg',
      };

      service['itemsSubject'].next([{ product: existingProduct, quantity: 1 }]);
      service.addProduct(existingProduct);

      const updateReq = httpMock.expectOne(`${service['apiUrl']}/items/${existingProduct.id}`);
      expect(updateReq.request.method).toBe('PATCH');
      expect(updateReq.request.body).toEqual({ quantity: 2 });
      updateReq.flush({});

      const loadReq = httpMock.expectOne(service['apiUrl']);
      expect(loadReq.request.method).toBe('GET');
      expect(listProductsUseCaseMock.refresh).toHaveBeenCalled();
      loadReq.flush({ items: [{ product: existingProduct, quantity: 2 }] });
    });
  });

  describe('#removeProduct', () => {
    it('should remove a product via HTTP DELETE and then reload the cart', () => {
      const productIdToRemove = 'prod-1';
      service.removeProduct(productIdToRemove);

      const deleteReq = httpMock.expectOne(`${service['apiUrl']}/items/${productIdToRemove}`);
      expect(deleteReq.request.method).toBe('DELETE');
      deleteReq.flush({});

      const loadReq = httpMock.expectOne(service['apiUrl']);
      expect(loadReq.request.method).toBe('GET');
      expect(listProductsUseCaseMock.refresh).toHaveBeenCalled();
      loadReq.flush({ items: [] });
    });
  });

  describe('#clearCart', () => {
    it('should clear the cart via HTTP POST and then update local state', () => {
      service.clearCart();

      const clearReq = httpMock.expectOne(`${service['apiUrl']}/clear`);
      expect(clearReq.request.method).toBe('POST');
      clearReq.flush({});

      expect(service['itemsSubject'].getValue()).toEqual([]);
      expect(listProductsUseCaseMock.refresh).toHaveBeenCalled();
    });
  });
});
