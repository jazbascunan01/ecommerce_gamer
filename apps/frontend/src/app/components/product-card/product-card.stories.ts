// src/app/components/product-card/product-card.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCardComponent } from './product-card.component';
import { Product } from '../../core/models/product.model';

const meta: Meta<ProductCardComponent> = {
  title: 'Components/ProductCard',
  component: ProductCardComponent,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<ProductCardComponent>;

const sampleProduct: Product = {
  id: '1',
  name: 'Mouse Gamer Pro X',
  description: 'El mejor mouse para gaming competitivo.',
  price: 5999,
  stock: 10,
  imageUrl: 'https://via.placeholder.com/300' // URL de imagen de ejemplo
};

// 1. La historia para un producto normal y en stock
export const Default: Story = {
  args: {
    product: sampleProduct,
  },
};

// 2. La historia para un producto sin stock
export const OutOfStock: Story = {
  args: {
    product: {
      ...sampleProduct,
      stock: 0,
    },
  },
};

// 3. La historia para un producto con un nombre muy largo
export const LongName: Story = {
  args: {
    product: {
      ...sampleProduct,
      name: 'Teclado Mecánico RGB Hyper-Quantum Strikeforce X Pro Max Ultra',
    },
  },
};
