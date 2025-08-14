import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Theme } from '../../services/theme';
import { ApiTheme, ApiChapter, ApiArticle } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { ArticleReader } from '../article-reader/article-reader';
import { FooterComponent } from '../../components/footer/footer.component';
import { BlurCoverComponent } from '../../components/blur-cover/blur-cover.component';
import { ChapterBar } from '../../components/chapter-bar/chapter-bar';

@Component({
  selector: 'app-theme-detail',
  imports: [
    CardModule,
    ButtonModule,
    TreeModule,
    MiniHeader,
    ArticleReader,
    RouterOutlet,
    FooterComponent,
    RouterLink,
    BlurCoverComponent,
    ChapterBar
  ],
  templateUrl: './theme-detail.html',
  styleUrl: './theme-detail.css'
})
export class ThemeDetail {
  themeService = inject(Theme);
  route = inject(ActivatedRoute);
  router = inject(Router);

  theme: ApiTheme | undefined = undefined;
  selectedArticleId = signal<string | undefined>(undefined);
  loading = true;
  error: string | undefined = undefined;

  // 树形节点数据
  treeNodes: any[] = [];

  constructor() {
    const themeId = this.route.snapshot.paramMap.get('id');

    if (themeId) {
      this.loadTheme(themeId);
    } else {
      this.error = '主题ID无效';
      this.loading = false;
    }

    // 监听路由参数变化
    this.route.params.subscribe(params => {
      // 如果URL中有文章ID，则选中对应的文章
      if (params['articleId']) {
        this.selectedArticleId.set(params['articleId']);
      }
    });
  }

  loadTheme(id: string) {
    this.themeService.getThemeWithDetail(id).subscribe({
      next: (response) => {
        if (response.data) {
          this.theme = response.data;
          this.buildTreeNodes();
        } else {
          this.error = '未找到指定主题';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('获取主题失败:', error);
        this.error = '获取主题失败: ' + (error.error?.message || error.message);
        this.loading = false;
      }
    });
  }

  buildTreeNodes() {
    if (!this.theme) return;

    this.treeNodes = this.theme.chapters.map(chapter => {
      return {
        label: chapter.name,
        data: { type: 'chapter', id: chapter.id },
        expanded: true,
        children: chapter.articles.map(article => {
          return {
            label: article.title,
            data: { type: 'article', id: article.id, article: article },
            icon: 'pi pi-file'
          };
        })
      };
    });
  }

  onNodeSelect(nodeData: {type: string, id: string, article?: ApiArticle}) {
    if (nodeData.type === 'article' && nodeData.article) {
      // 导航到文章页面，同时传递主题数据
      this.router.navigate([`/theme/${this.theme?.id}/article`, nodeData.id]);
      this.selectedArticleId.set(nodeData.id);
    }
  }
}
