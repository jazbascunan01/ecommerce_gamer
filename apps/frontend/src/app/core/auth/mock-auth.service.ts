import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class MockAuthService {
  user$ = of(null);

  logout(): void {
  }
}
