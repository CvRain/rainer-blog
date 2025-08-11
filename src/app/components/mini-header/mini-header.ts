import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-mini-header',
  imports: [
    RippleModule,
    CardModule
  ],
  templateUrl: './mini-header.html',
  styleUrl: './mini-header.css'
})
export class MiniHeader {
  isMobileMenuOpen = false;
  isDarkMode = false;

  constructor(private router: Router) {
    // 初始化时检查当前主题
    if (typeof document !== 'undefined') {
      this.isDarkMode = document.documentElement.classList.contains('app-dark');
    }
  }

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
    // 切换暗色/亮色主题
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('app-dark', this.isDarkMode);

    // 保存用户选择到 localStorage
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  showComingSoon() {
    if (typeof window !== 'undefined') {
      alert('暂未完成');
    }
  }
}