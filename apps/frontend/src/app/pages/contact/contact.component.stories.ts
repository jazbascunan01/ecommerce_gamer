import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { ContactComponent } from './contact.component';

const meta: Meta<ContactComponent> = {
  title: 'Pages/Contact',
  component: ContactComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
};

export default meta;
type Story = StoryObj<ContactComponent>;

export const Default: Story = {
  name: 'Página de Contacto',
};
