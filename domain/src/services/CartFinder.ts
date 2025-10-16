import { Cart } from '../entities/Cart';

export interface CartFinder {
  find(userId: string): Promise<Cart | null>;
}
