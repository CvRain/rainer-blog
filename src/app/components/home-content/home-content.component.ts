import { Component, input, OnInit } from '@angular/core';
import { SelfIntroCardComponent } from '../self-intro-card/self-intro-card.component';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { UserInfo, ApiArticle } from '../../services/types';
import { Article } from '../../services/article';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home-content',
  imports: [
    SelfIntroCardComponent,
    ArticleCardComponent
  ],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent implements OnInit {
  articleService = inject(Article);
  
  userInfo = input<UserInfo>({
    user_avatar: '',
    user_background: '',
    user_email: '',
    user_name: '',
    user_signature: ''
  });
  
  articles: ApiArticle[] = [];

  ngOnInit() {
    this.loadArticles();
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
}