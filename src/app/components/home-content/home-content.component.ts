import { Component, input, OnInit } from '@angular/core';
import { SelfIntroCardComponent } from '../self-intro-card/self-intro-card.component';
import { ArticleCardComponent } from '../article-card/article-card.component';
import {UserInfo, ApiArticle, BaseThemeSchema} from '../../services/types';
import { Article } from '../../services/article';
import { inject } from '@angular/core';
import {Theme} from '../../services/theme';
import {ThemeCardComponent} from '../theme-card/theme-card.component';

@Component({
  selector: 'app-home-content',
  imports: [
    SelfIntroCardComponent,
    ArticleCardComponent,
    ThemeCardComponent
  ],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent implements OnInit {
  articleService = inject(Article);
  themeService = inject(Theme)

  userInfo = input<UserInfo>({
    user_avatar: '',
    user_background: '',
    user_email: '',
    user_name: '',
    user_signature: ''
  });

  articles: ApiArticle[] = [] as ApiArticle[];
  themes: BaseThemeSchema[] = [] as BaseThemeSchema[];

  ngOnInit() {
    this.loadArticles();
    this.loadThemes();
  }

  loadArticles() {
    this.articleService.getPublicArticleList(1, 10).subscribe({
      next: (response) => {
        if (response.data) {
          this.articles = response.data;
        }
      },
      error: (error) => {
        console.error('获取文章列表失败:', error);
      }
    });
  }

  loadThemes() {
    this.themeService.getActiveThemes().subscribe({
      next: (response) => {
        if (response.data) {
          // 按更新时间排序并只取前3个
          this.themes = response.data
            .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 3);
        }
      },
      error: (error) => {
        console.error('获取主题列表失败:', error);
      }
    });
  }
}