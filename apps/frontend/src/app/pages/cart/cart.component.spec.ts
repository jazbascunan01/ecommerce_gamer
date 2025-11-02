import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CartComponent } from './cart.component';
import { IProductRepository } from '../../core/repositories/product.repository';
import { AuthService } from '../../core/auth/auth.service';
import { MockAuthService } from '../../core/auth/mock-auth.service';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let productRepositoryMock: Partial<IProductRepository>;

  beforeEach(async () => {
    productRepositoryMock = {
      getAllProducts: () => of([]),
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: IProductRepository, useValue: productRepositoryMock },
        { provide: AuthService, useClass: MockAuthService }, // <-- AÑADIR ESTA LÍNEA
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
