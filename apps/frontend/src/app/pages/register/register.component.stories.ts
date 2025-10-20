import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { userEvent, within } from '@storybook/testing-library';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../core/auth/auth.service';

// --- 1. Configuración de la Historia (Meta) ---
const meta: Meta<RegisterComponent> = {
  title: 'Pages/Register',
  component: RegisterComponent,
  tags: ['autodocs'],
  decorators: [
    // Usamos applicationConfig para proveer los servicios que el componente necesita
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        // Por defecto, simulamos que el servicio AuthService funciona correctamente
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

// --- 2. Definición de las Historias ---

// Estado por defecto: Formulario vacío
export const Default: Story = {
  name: 'Estado Inicial',
};

// Estado: Formulario con datos válidos, listo para enviar
export const FilledAndValid: Story = {
  name: 'Formulario Válido',
  // `play` es una función de Storybook para simular interacciones del usuario
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

// Estado: Simula un error del servidor (ej: email ya existe)
export const ServerError: Story = {
  name: 'Error del Servidor',
  // Sobreescribimos el provider de AuthService para que devuelva un error
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
  // Simulamos que el usuario llena el formulario y lo envía
  play: async (context) => {
    await FilledAndValid.play!(context); // Reutilizamos la interacción anterior
    const canvas = within(context.canvasElement);
    const submitButton = canvas.getByRole('button', { name: /Registrarse/i });
    await userEvent.click(submitButton);
  },
};
