import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { userEvent, within } from '@storybook/testing-library';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/auth/auth.service';

const meta: Meta<RegisterComponent> = {
  title: 'Pages/Register',
  component: RegisterComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            register: (userData: any) => of({ success: true }),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<RegisterComponent>;


export const Default: Story = {
  name: 'Estado Inicial',
};

export const FilledAndValid: Story = {
  name: 'Formulario Válido',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameInput = canvas.getByLabelText(/Nombre/i);
    const emailInput = canvas.getByLabelText(/Email/i);
    const passwordInput = canvas.getByLabelText(/Contraseña/i);

    await userEvent.type(nameInput, 'Test User', { delay: 50 });
    await userEvent.type(emailInput, 'test@example.com', { delay: 50 });
    await userEvent.type(passwordInput, 'password123', { delay: 50 });
  },
};

export const ServerError: Story = {
  name: 'Error del Servidor',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: () => throwError(() => new Error('El email ya está en uso')),
          },
        },
      ],
    }),
  ],
  play: async (context) => {
    await FilledAndValid.play!(context);
    const canvas = within(context.canvasElement);
    const submitButton = canvas.getByRole('button', { name: /Registrarse/i });
    await userEvent.click(submitButton);
  },
};
