import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { CartComponent } from './cart.component';
import { CartService } from '../../core/state/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

const mockCartItems: CartItem[] = [
  {
    product: {
      id: 'prod-1',
      name: 'Teclado Mecánico RGB',
      description: 'Un teclado increíble para gamers.',
      price: 89.99,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',
    },
    quantity: 2,
  },
  {
    product: {
      id: 'prod-2',
      name: 'Mouse Gamer Inalámbrico',
      description: 'Precisión y libertad de movimiento.',
      price: 49.99,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1694175640153-00c83f4a36ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2080',
    },
    quantity: 1,
  },
];

const mockTotalPrice = mockCartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

/**
 * Crea un mock del CartService para las historias.
 * @param items - Array de items en el carrito.
 * @param loading - Estado de carga.
 * @returns Un objeto que simula el CartService.
 */
const createMockCartService = (items: CartItem[], loading: boolean) => ({
  items$: of(items),
  totalPrice$: of(items.reduce((total, item) => total + item.product.price * item.quantity, 0)),
  loading$: of(loading),
  removeProduct: () => {},
  updateQuantity: () => {},
});

const meta: Meta<CartComponent> = {
  title: 'Pages/Cart',
  component: CartComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CartComponent>;


/**
 * Historia para cuando el carrito tiene productos.
 */
export const WithItems: Story = {
  name: 'Con Productos',
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: createMockCartService(mockCartItems, false) },
      ],
    }),
  ],
};

/**
 * Historia para cuando el carrito está vacío.
 */
export const Empty: Story = {
  name: 'Carrito Vacío',
  decorators: [
    applicationConfig({
      providers: [
        { provide: CartService, useValue: createMockCartService([], false) },
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
        { provide: CartService, useValue: createMockCartService(mockCartItems, true) },
      ],
    }),
  ],
};
