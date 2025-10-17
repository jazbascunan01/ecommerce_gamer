import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [

  {
    path: 'products/edit/:id',
    loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
  },
];
