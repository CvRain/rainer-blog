import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Article } from '../../services/article';
import { ApiArticleContent, BaseResponse } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DatePipe } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MarkdownViewer } from '../../components/markdown-viewer/markdown-viewer';

@Component({
  selector: 'app-article-reader',
  imports: [CardModule, ButtonModule, DividerModule, DatePipe, RouterOutlet, FooterComponent, MarkdownViewer],
  templateUrl: './article-reader.html',
  styleUrl: './article-reader.css'
})

export class ArticleReader implements OnInit {
  article: ApiArticleContent | undefined = undefined;
  loading = true;
  error: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: Article
  ) {
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
