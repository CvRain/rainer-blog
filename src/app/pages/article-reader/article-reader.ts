import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Article } from '../../services/article';
import { ApiArticleContent, BaseResponse, UserInfo } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DatePipe } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MarkdownViewer } from '../../components/markdown-viewer/markdown-viewer';
import { User } from '../../services/user';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-article-reader',
  imports: [CardModule, ButtonModule, DividerModule, DatePipe, RouterOutlet, FooterComponent, HeaderComponent, MarkdownViewer],
  templateUrl: './article-reader.html',
  styleUrl: './article-reader.css'
})

export class ArticleReader implements OnInit {
  article: ApiArticleContent | undefined = undefined;
  loading = true;
  error: string | undefined = undefined;
  userService = inject(User);
  userInfo: UserInfo = {} as UserInfo;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: Article,
    private titleService: Title
  ) {
    const result = this.userService.getUserInfo();
    result.subscribe(res => {
      this.userInfo = res.data || {
        user_avatar: '',
        user_background: '',
        user_email: '',
        user_name: 'unknown',
        user_signature: 'unknown'
      };
      console.log(this.userInfo);
    });
  }

  ngOnInit() {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.loadArticle(articleId);
    } else {
      this.error = '文章ID无效';
      this.loading = false;
    }
  }

  loadArticle(id: string) {
    this.articleService.getArticleS3ContentById(id).subscribe({
      next: (response: BaseResponse<ApiArticleContent>) => {
        if(response.code !== 200){
          this.error = response.message;
          this.loading = false;
          return;
        }
        if (response.data) {
          this.article = response.data;
          this.titleService.setTitle(this.article.title)
        } else {
          this.error = '未找到指定文章';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('获取文章失败:', error);
        this.error = '获取文章失败: ' + (error.error?.message || error.message);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
