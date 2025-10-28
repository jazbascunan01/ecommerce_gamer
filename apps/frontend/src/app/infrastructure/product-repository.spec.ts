import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PrismaProductRepository } from './product-repository.service';

describe('ProductRepository', () => {
  let service: PrismaProductRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PrismaProductRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
