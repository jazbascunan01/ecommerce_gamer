import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';import { CartService } from '../../core/state/cart.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  totalItemsInCart$: Observable<number>;
  user$: Observable<User | null>;
  isAdmin$: Observable<boolean>;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.totalItemsInCart$ = this.cartService.totalItems$;
    this.user$ = this.authService.user$;
    this.isAdmin$ = this.authService.isAdmin$;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
