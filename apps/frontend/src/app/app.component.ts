import { Component, signal, HostListener, Renderer2, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly title = signal('frontend');

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('document:focusin', ['$event'])
  onFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' && ['text', 'email', 'password', 'number', 'search', 'url'].includes((target as HTMLInputElement).type)) {
      this.renderer.addClass(document.body, 'text-input-focused');
    }
  }

  @HostListener('document:focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT') {
      this.renderer.removeClass(document.body, 'text-input-focused');
    }
  }
}
