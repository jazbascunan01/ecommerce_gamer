import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { ProductService } from '../../../core/services/product.service';
import { ProductStats } from '../../../core/models/product.model';

const mockStats: ProductStats = {
  totalProducts: 12,
  totalStock: 350,
  totalStockValue: 15890.5,
  productsOutOfStock: 2,
  averageProductPrice: 132.42,
  highestStockProduct: {
    name: 'Mouse Gamer Pro',
    stock: 50,
  },
};

const meta: Meta<DashboardComponent> = {
  title: 'Pages/Admin/Dashboard',
  component: DashboardComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        {
          provide: ProductService,
          useValue: {
            getProductStats: () => of(mockStats),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<DashboardComponent>;

/**
 * Vista por defecto del Dashboard con datos de ejemplo.
 */
export const Default: Story = {
  name: 'Vista Principal',
};

/**
 * Simula el estado de carga mientras se obtienen las estadísticas.
 */
export const Loading: Story = {
  name: 'Estado de Carga',
  decorators: [
    applicationConfig({
      providers: [
        { provide: ProductService, useValue: { getProductStats: () => of(null) } },
      ],
    }),
  ],
};