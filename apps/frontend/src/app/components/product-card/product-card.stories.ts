import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { ProductCardComponent } from './product-card.component';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/state/cart.service';
import { AuthService } from '../../core/auth/auth.service';
import { ProductService } from '../../core/services/product.service';
import { ListProductsUseCase } from '../../application/list-products.service';
import { User } from '../../core/models/user.model';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Teclado Mecánico RGB',
  description: 'Un teclado increíble para gamers.',
  price: 89.99,
  stock: 15,
  imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',
};

const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'CUSTOMER'
};

const meta: Meta<ProductCardComponent> = {
  title: 'Components/ProductCard',
  component: ProductCardComponent,
  tags: ['autodocs'],
  args: {
    product: mockProduct,
  },
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: { addProduct: () => console.log('addProduct called') } },
        { provide: AuthService, useValue: { user$: of(mockUser), isAdmin$: of(false) } },
        { provide: ProductService, useValue: { deleteProduct: () => of({}) } },
        { provide: ListProductsUseCase, useValue: { refresh: () => {} } },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductCardComponent>;


export const Default: Story = {
  name: 'Vista Cliente'
};

export const AsAdmin: Story = {
  name: 'Vista Administrador',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AuthService, useValue: { user$: of(mockUser), isAdmin$: of(true) } },
      ],
    }),
  ],
};

export const OutOfStock: Story = {
  name: 'Sin Stock',
  args: {
    product: { ...mockProduct, stock: 0 },
  },
};
