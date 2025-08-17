import { Component, inject, input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Article } from '../../services/article';
import { ApiArticleContent, BaseResponse, UserInfo } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DatePipe } from '@angular/common';
import { MarkdownViewer } from '../../components/markdown-viewer/markdown-viewer';
import { User } from '../../services/user';
import {Title} from '@angular/platform-browser';
import {MiniHeader} from '../../components/mini-header/mini-header';
import {SimpleFooter} from '../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-article-reader',
  imports: [CardModule, ButtonModule, DividerModule, DatePipe, RouterOutlet, MarkdownViewer, MiniHeader, SimpleFooter],
  templateUrl: './article-reader.html',
  styleUrl: './article-reader.css'
})

export class ArticleReader implements OnInit {
  article: ApiArticleContent | undefined = undefined;
  loading = true;
  error: string | undefined = undefined;
  userService = inject(User);
  userInfo: UserInfo = {} as UserInfo;
  
  // 添加输入属性，支持通过路由参数或直接传入ID获取文章
  articleId = input<string | undefined>(undefined);
  // 添加输入属性，控制是否显示header，默认显示
  showHeader = input<boolean>(true);

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
    // 检查是否有通过输入属性传入的ID
    const inputArticleId = this.articleId();
    if (inputArticleId) {
      this.loadArticle(inputArticleId);
      return;
    }
    
    // 如果没有通过输入属性传入，则从路由参数获取
    const routeArticleId = this.route.snapshot.paramMap.get('id');
    if (routeArticleId) {
      this.loadArticle(routeArticleId);
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
    // 检查浏览器历史记录，如果有则返回上一页，否则导航到首页
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}