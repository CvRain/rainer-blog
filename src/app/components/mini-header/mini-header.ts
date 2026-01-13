import { Component, computed, inject } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mini-header',
  imports: [CommonModule, RippleModule, ButtonModule],
  templateUrl: './mini-header.html',
  styleUrl: './mini-header.css',
})
export class MiniHeader {
  isMobileMenuOpen = false;
  themeService = inject(ThemeService);
  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  constructor(private router: Router) {}

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

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToArchive() {
    this.router.navigate(['/archive']);
  }

  showComingSoon() {
    if (typeof window !== 'undefined') {
      alert('暂未完成');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
