import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { ContactComponent } from './contact.component';

// 1. Configuración de la Historia (Meta)
const meta: Meta<ContactComponent> = {
  title: 'Pages/Contact',
  component: ContactComponent,
  tags: ['autodocs'],
  // Proveemos el Router por si el componente usa o usará `routerLink`
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
};

export default meta;
type Story = StoryObj<ContactComponent>;

// 2. Definición de la Historia
export const Default: Story = {
  name: 'Página de Contacto',
};
