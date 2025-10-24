import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of, throwError, NEVER } from 'rxjs';
import { userEvent, within } from '@storybook/testing-library';

import { expect } from '@storybook/jest';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/auth.service';

const meta: Meta<LoginComponent> = {
  title: 'Pages/Login',
  component: LoginComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: (credentials: any) => of({ token: 'fake-jwt-token' }),
          },
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<LoginComponent>;


export const Default: Story = {
  name: 'Estado Inicial',
};

export const FillingForm: Story = {
  name: 'Formulario Lleno',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailInput = canvas.getByLabelText(/Email/i);
    const passwordInput = canvas.getByLabelText(/Contraseña/i);

    await userEvent.type(emailInput, 'customer@example.com', { delay: 50 });
    await userEvent.type(passwordInput, 'password123', { delay: 50 });
  },
};

export const InvalidCredentials: Story = {
  name: 'Error: Credenciales Inválidas',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: () => throwError(() => new Error('Invalid credentials')),
          },
        },
      ],
    }),
  ],
  play: async (context) => {
    await FillingForm.play!(context);
    const canvas = within(context.canvasElement);
    const submitButton = canvas.getByRole('button', { name: /Iniciar Sesión/i });
    await userEvent.click(submitButton);
  },
};

export const SuccessfulLogin: Story = {
  name: 'Éxito: Login Correcto',
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await FillingForm.play!(context);

    const router = context['application'].injector.get(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    const submitButton = canvas.getByRole('button', { name: /Iniciar Sesión/i });
    await userEvent.click(submitButton);

    expect(navigateSpy).toHaveBeenCalledWith(['/products']);
  },
};

export const Loading: Story = {
  name: 'Estado: Cargando',
  decorators: [
    applicationConfig({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: () => NEVER,
          },
        },
      ],
    }),
  ],
  play: async (context) => {
    await FillingForm.play!(context);
    const canvas = within(context.canvasElement);
    const submitButton = canvas.getByRole('button', { name: /Iniciar Sesión/i });
    await userEvent.click(submitButton);
  },
};
