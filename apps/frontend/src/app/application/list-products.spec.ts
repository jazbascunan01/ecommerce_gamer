import { TestBed } from '@angular/core/testing';

import { ListProducts } from './list-products';

describe('ListProducts', () => {
  let service: ListProducts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListProducts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
