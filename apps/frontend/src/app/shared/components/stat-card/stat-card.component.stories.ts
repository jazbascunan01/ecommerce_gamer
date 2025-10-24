import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CurrencyPipe } from '@angular/common';
import { StatCardComponent } from './stat-card.component';

const meta: Meta<StatCardComponent> = {
  title: 'Components/StatCard',
  component: StatCardComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [CurrencyPipe],
    }),
  ],
  argTypes: {
    icon: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<StatCardComponent>;

export const Default: Story = {
  name: 'Valor Numérico',
  args: {
    icon: '📦',
    label: 'Productos Diferentes',
  },
  render: (args) => ({
    props: args,
    template: `<app-stat-card [icon]="icon" [label]="label"><p class="stat-value">12</p></app-stat-card>`,
  }),
};

export const Currency: Story = {
  name: 'Valor con Moneda',
  args: {
    icon: '💰',
    label: 'Valor Total del Stock',
  },
  render: (args) => ({
    props: args,
    template: `<app-stat-card [icon]="icon" [label]="label"><p class="stat-value">{{ 15890.50 | currency:'ARS':'$' }}</p></app-stat-card>`,
  }),
};

export const TextValue: Story = {
  name: 'Valor de Texto',
  args: {
    icon: '👑',
    label: 'Producto con más stock',
  },
  render: (args) => ({
    props: args,
    template: `<app-stat-card [icon]="icon" [label]="label"><p class="stat-value small-text">Mouse Gamer Pro</p></app-stat-card>`,
  }),
};