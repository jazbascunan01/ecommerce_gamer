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

export const Default: Story = {
  args: {
    product: sampleProduct,
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...sampleProduct,
      stock: 0,
    },
  },
};

export const LongName: Story = {
  args: {
    product: {
      ...sampleProduct,
      name: 'Teclado Mecánico RGB Hyper-Quantum Strikeforce X Pro Max Ultra',
    },
  },
};
