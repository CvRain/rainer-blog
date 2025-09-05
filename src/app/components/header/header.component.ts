import { Component, computed, inject, input } from "@angular/core";
import { RippleModule } from "primeng/ripple";
import { RouterOutlet, Router } from "@angular/router";
import { Card } from "primeng/card";
import { Image } from "primeng/image";
import { ThemeService } from "../../services/theme.service";

@Component({
  selector: "app-header",
  imports: [RippleModule, RouterOutlet, Card, Image],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  themeService = inject(ThemeService);
  isDarkMode = computed(() => this.themeService.theme() === "dark");

  userName = input<string>("用户名");
  userAvatar = input<string | undefined>("");

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      if (this.isMobileMenuOpen) {
        mobileMenu.classList.remove("hidden");
      } else {
        mobileMenu.classList.add("hidden");
      }
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  navigateToHome() {
    this.router.navigate(["/"]);
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }

  navigateToArchive() {
    this.router.navigate(["/archive"]);
  }

  showComingSoon() {
    alert("暂未完成");
  }
}
