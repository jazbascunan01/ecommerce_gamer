import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError, NEVER } from 'rxjs';

import { ProductDetailComponent } from './product-detail.component';
import { CartService } from '../../core/state/cart.service';
import { Product } from '../../core/models/product.model';
import { GetProductByIdUseCase } from '../../application/get-product-by-id.service';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Teclado Mecánico RGB',
  description:
    'Un teclado increíble para gamers con switches rojos, perfecto para largas sesiones de juego y escritura. Retroiluminación RGB totalmente personalizable.',
  price: 89.99,
  stock: 15,
  imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',
};

const meta: Meta<ProductDetailComponent> = {
  title: 'Pages/ProductDetail',
  component: ProductDetailComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ProductDetailComponent>;


/**
 * Historia para cuando el producto se encuentra y se muestra.
 */
export const Found: Story = {
  name: 'Producto Encontrado',
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: { addProduct: () => {} } },
        { provide: GetProductByIdUseCase, useValue: { execute: () => of(mockProduct) } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', 'prod-1']])),
          },
        },
      ],
    }),
  ],
};

/**
 * Historia para simular el estado de carga.
 */
export const Loading: Story = {
  name: 'Cargando',
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: { addProduct: () => {} } },
        { provide: GetProductByIdUseCase, useValue: { execute: () => NEVER } },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(new Map([['id', 'prod-1']])) },
        },
      ],
    }),
  ],
};

/**
 * Historia para cuando el producto no se encuentra (error 404).
 */
export const NotFound: Story = {
  name: 'Producto No Encontrado',
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: CartService, useValue: { addProduct: () => {} } },
        { provide: GetProductByIdUseCase, useValue: { execute: () => throwError(() => new Error('Product not found')) } },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(new Map([['id', 'prod-1']])) },
        },
      ],
    }),
  ],
};
