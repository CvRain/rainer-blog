import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Theme } from '../../services/theme';
import { ApiTheme, ApiChapter, ApiArticle } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { FooterComponent } from '../../components/footer/footer.component';
import { BlurCoverComponent } from '../../components/blur-cover/blur-cover.component';
import { ChapterBar } from '../../components/chapter-bar/chapter-bar';
import { CoverService } from '../../services/cover.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-detail',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TreeModule,
    FooterComponent,
    BlurCoverComponent,
    ChapterBar,
    MiniHeader,
  ],
  templateUrl: './theme-detail.html',
  styleUrl: './theme-detail.css',
})
export class ThemeDetail implements OnInit {
  themeService = inject(Theme);
  coverService = inject(CoverService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  theme: ApiTheme = {} as ApiTheme;
  coverUrl = signal<string>('images/theme-default-cover.jpg');

  ngOnInit(): void {
    const themeId = this.route.snapshot.paramMap.get('id');
    if (!themeId) {
      return;
    }
    const getThemeResult = this.themeService.getThemeWithDetail(themeId);
    getThemeResult.subscribe((res) => {
      this.theme = res.data || ({} as ApiTheme);
      this.loadCover(themeId);
    });
  }

  loadCover(themeId: string) {
    this.coverService.getCoverUrl('theme', themeId).subscribe((url) => {
      if (url) {
        this.coverUrl.set(url);
      }
    });
  }

  onArticleSelected(article: ApiArticle): void {
    this.router.navigate(['/article', article.id], {
      state: { theme: this.theme },
    });
  }
}
