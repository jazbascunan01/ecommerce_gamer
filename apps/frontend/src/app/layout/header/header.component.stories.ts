import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/auth/auth.service';
import { CartService } from '../../core/state/cart.service';
import { User } from '../../core/models/user.model';
import { ListProductsUseCase } from '../../application/list-products.service';


const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'CUSTOMER'
};

const mockAdmin: User = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'ADMIN'
};


const meta: Meta<HeaderComponent> = {
  title: 'Layout/Header',
  component: HeaderComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthService, useValue: { user$: of(null), isAdmin$: of(false) } },
        { provide: CartService, useValue: { totalItems$: of(0) } },
        { provide: ListProductsUseCase, useValue: { refresh: () => {} } }
      ],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<HeaderComponent>;



export const LoggedOut: Story = {
  name: 'Estado: Deslogueado'
};

export const LoggedInCustomer: Story = {
  name: 'Estado: Cliente Logueado',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AuthService, useValue: { user$: of(mockUser), isAdmin$: of(false) } },
        { provide: CartService, useValue: { totalItems$: of(3) } }
      ]
    })
  ]
};

export const LoggedInAdmin: Story = {
  name: 'Estado: Administrador Logueado',
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AuthService, useValue: { user$: of(mockAdmin), isAdmin$: of(true) } },
        { provide: CartService, useValue: { totalItems$: of(1) } }
      ]
    })
  ]
};
