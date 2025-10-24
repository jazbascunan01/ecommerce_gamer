import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ListProductsUseCase } from '../../../application/list-products.service';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Teclado Mecánico RGB',
  description: 'Un teclado increíble para gamers.',
  price: 89.99,
  stock: 15,
  imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',
};

const meta: Meta<ProductFormComponent> = {
  title: 'Pages/Admin/ProductForm',
  component: ProductFormComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ProductService,
          useValue: {
            getProductById: (id: string) => of(mockProduct),
            createProduct: (product: any) => of({ ...product, id: 'new-prod' }),
            updateProduct: (id: string, product: any) => of({ ...product, id }),
          },
        },
        { provide: ListProductsUseCase, useValue: { refresh: () => {} } },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProductFormComponent>;


/**
 * Historia para el modo "Crear Producto".
 * Simulamos que no hay un ID en la URL.
 */
export const CreateMode: Story = {
  name: 'Modo Creación',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} },
          },
        },
      ],
    }),
  ],
};

/**
 * Historia para el modo "Editar Producto".
 * Simulamos que la URL contiene un ID de producto.
 */
export const EditMode: Story = {
  name: 'Modo Edición',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 'prod-1' } },
          },
        },
      ],
    }),
  ],
};
