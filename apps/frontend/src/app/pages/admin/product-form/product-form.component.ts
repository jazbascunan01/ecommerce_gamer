import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { ListProductsUseCase } from '../../../application/list-products.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isLoading = false;
  pageTitle = 'Crear Producto';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private listProductsUseCase: ListProductsUseCase
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', [Validators.required]] // Eliminamos la validación de patrón
    });

    // Lógica para cargar datos en modo edición (la implementaremos en los siguientes pasos)
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.pageTitle = 'Editar Producto';
      this.loadProductData(this.productId);
    }
  }

  loadProductData(id: string): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Usamos patchValue para rellenar el formulario con los datos del producto.
        this.productForm.patchValue(product);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        alert('No se pudo cargar el producto. Redirigiendo a la lista.');
        this.router.navigate(['/products']);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      // Marcar todos los campos como 'touched' para mostrar los errores
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    // Aseguramos que los valores numéricos se envíen como números
    const productData = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      stock: Number(this.productForm.value.stock)
    };

    if (this.isEditMode && this.productId) {
      // --- MODO EDICIÓN ---
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          console.log('Producto actualizado con éxito');
          this.listProductsUseCase.refresh(); // Actualiza la lista de productos
          this.router.navigate(['/products']); // Redirige a la lista
        },
        error: (err) => {
          console.error('Error al actualizar el producto:', err);
          alert('Hubo un error al actualizar el producto.');
          this.isLoading = false;
        }
      });
    } else {
      // --- MODO CREACIÓN ---
      this.productService.createProduct(productData).subscribe({
        next: () => {
          console.log('Producto creado con éxito');
          this.listProductsUseCase.refresh(); // Actualiza la lista de productos
          this.router.navigate(['/products']); // Redirige a la lista
        },
        error: (err) => {
          console.error('Error al crear el producto:', err);
          alert('Hubo un error al crear el producto.');
          this.isLoading = false;
        }
      });
    }
  }
}