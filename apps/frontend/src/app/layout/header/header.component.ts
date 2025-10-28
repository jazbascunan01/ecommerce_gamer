import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';import { CartService } from '../../core/state/cart.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  totalItemsInCart$: Observable<number>;
  user$: Observable<User | null>;
  isAdmin$: Observable<boolean>;
  isCartAnimating = false;
  private cartSub!: Subscription;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.totalItemsInCart$ = this.cartService.totalItems$;
    this.user$ = this.authService.user$;
    this.isAdmin$ = this.authService.isAdmin$;
    this.cartSub = this.cartService.itemAdded$.subscribe(added => {
      if (added) {
        this.isCartAnimating = true;
        setTimeout(() => this.isCartAnimating = false, 600);
      }
    });
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.cartSub) {
      this.cartSub.unsubscribe();
    }
  }
}
