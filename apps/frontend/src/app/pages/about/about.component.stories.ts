import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideRouter } from '@angular/router';

import { AboutComponent } from './about.component';

const meta: Meta<AboutComponent> = {
  title: 'Pages/About',
  component: AboutComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideRouter([])],
    }),
  ],
};

export default meta;
type Story = StoryObj<AboutComponent>;

export const Default: Story = {
  name: 'Página Acerca de',
};
