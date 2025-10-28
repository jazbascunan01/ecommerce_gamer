import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { IProductRepository } from './core/repositories/product.repository';
import { PrismaProductRepository } from './infrastructure/product-repository.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
};
