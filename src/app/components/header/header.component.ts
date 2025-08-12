import { Component, input } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { RouterOutlet, Router } from '@angular/router';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-header',
  imports: [
    RippleModule,
    RouterOutlet,
    Card
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  isDarkMode = false;

  userName = input<string>('用户名');

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

  navigateToArchive(){
    this.router.navigate(['/archive']);
  }

  showComingSoon() {
    alert('暂未完成');
  }
}
