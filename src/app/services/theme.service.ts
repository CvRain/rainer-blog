import {
  Injectable,
  signal,
  effect,
  Renderer2,
  RendererFactory2,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";

type Theme = "light" | "dark";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private renderer: Renderer2;
  private head: HTMLElement;
  private themeLink: HTMLLinkElement;

  theme = signal<Theme>("light");
  // 新增：Catppuccin 主题类型
  private catppuccinTheme = signal<'latte' | 'mocha'>('latte');

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.head = this.document.head;
    this.themeLink = this.document.createElement("link");
    this.renderer.setAttribute(this.themeLink, "rel", "stylesheet");
    this.renderer.setAttribute(this.themeLink, "type", "text/css");
    this.renderer.appendChild(this.head, this.themeLink);

    const savedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.theme.set(initialTheme);

    effect(() => {
      const currentTheme = this.theme();
      const catppuccin = this.catppuccinTheme();
      localStorage.setItem("theme", currentTheme);
      localStorage.setItem("catppuccin", catppuccin);

      if (currentTheme === "dark") {
        this.renderer.addClass(this.document.documentElement, "app-dark");
        this.themeLink.href = "theme/lara-dark-blue/theme.css"; // PrimeNG dark theme
        this.updateMarkdownTheme("mocha");
      } else {
        this.renderer.removeClass(this.document.documentElement, "app-dark");
        this.themeLink.href = "theme/lara-light-blue/theme.css"; // PrimeNG light theme
        this.updateMarkdownTheme("latte");
      }
    });
  }

  toggleTheme() {
    this.theme.update((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
    this.catppuccinTheme.update((current) =>
      current === 'latte' ? 'mocha' : 'latte'
    );
  }

  private updateMarkdownTheme(catppuccin: 'latte' | 'mocha') {
    this.removeMarkdownStyles();
    const markdownThemeLink = this.renderer.createElement(
      "link",
    ) as HTMLLinkElement;
    this.renderer.setAttribute(markdownThemeLink, "rel", "stylesheet");
    this.renderer.setAttribute(markdownThemeLink, "type", "text/css");
    this.renderer.setAttribute(
      markdownThemeLink,
      "data-markdown-theme",
      "true",
    );
    this.renderer.setAttribute(
      markdownThemeLink,
      "href",
      `styles/catppuccin-${catppuccin}.css`,
    );
    this.renderer.appendChild(this.head, markdownThemeLink);
  }

  private removeMarkdownStyles() {
    const existingLink = this.document.querySelector(
      'link[data-markdown-theme="true"]',
    );
    if (existingLink) {
      this.renderer.removeChild(this.head, existingLink);
    }
  }
}
