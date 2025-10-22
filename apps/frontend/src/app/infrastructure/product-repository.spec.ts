import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductRepository } from './product-repository.service';

describe('ProductRepository', () => {
  let service: ProductRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
