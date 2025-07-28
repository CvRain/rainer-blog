import { Component } from '@angular/core';
import { File, Home, Menu, LucideAngularModule } from 'lucide-angular';
import { RippleModule } from 'primeng/ripple';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    LucideAngularModule,
    RippleModule,
    RouterOutlet
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      if (this.isMobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    }
  }
}
