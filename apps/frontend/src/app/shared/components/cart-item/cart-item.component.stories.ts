import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from './cart-item.component';
import { CartItem } from '../../../core/models/cart-item.model';

const meta: Meta<CartItemComponent> = {
  title: 'Components/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
  argTypes: {
    remove: { action: 'remove' },
    quantityChange: { action: 'quantityChange' },
  },
};

export default meta;
type Story = StoryObj<CartItemComponent>;

const mockItem: CartItem = {
  product: {
    id: 'prod-1',
    name: 'Teclado Mecánico RGB HyperX',
    description: 'Un teclado increíble para gamers.',
    price: 89.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=1935&auto=format&fit=crop',
  },
  quantity: 2,
};

export const Default: Story = {
  name: 'Estado por Defecto',
  args: {
    item: mockItem,
    isLoading: false,
  },
};

export const Loading: Story = {
  name: 'Estado de Carga',
  args: {
    item: mockItem,
    isLoading: true,
  },
};