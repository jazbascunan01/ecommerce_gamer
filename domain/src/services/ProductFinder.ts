import { Product } from '../entities/Product';

export interface ProductFinder {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}
