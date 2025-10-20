import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, NEVER } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ListProductsUseCase } from '../../application/list-products.service';
import { Product } from '../../core/models/product.model';

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Teclado Mecánico RGB',
    description: 'Un teclado increíble para gamers.',
    price: 89.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',
  },
  {
    id: 'prod-2',
    name: 'Mouse Gamer Inalámbrico',
    description: 'Precisión y libertad de movimiento.',
    price: 49.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1694175640153-00c83f4a36ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080',
  },
  {
    id: 'prod-3',
    name: 'Monitor Curvo 27" 144Hz',
    description: 'Inmersión total en tus juegos.',
    price: 320.50,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?q=80&w=1964&auto=format&fit=crop',
  },
];

const meta: Meta<ProductListComponent> = {
  title: 'Pages/ProductList',
  component: ProductListComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ListProductsUseCase,
          useValue: {
            products$: of(mockProducts),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductListComponent>;


export const WithProducts: Story = {
  name: 'Con Productos',
};

export const Empty: Story = {
  name: 'Sin Productos',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ListProductsUseCase,
          useValue: {
            products$: of([]),
          },
        },
      ],
    }),
  ],
};

export const Loading: Story = {
  name: 'Cargando',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ListProductsUseCase,
          useValue: {
            products$: NEVER,
          },
        },
      ],
    }),
  ],
};
