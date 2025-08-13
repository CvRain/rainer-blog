import { Component, inject, OnInit, signal } from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { Theme } from '../../services/theme';
import { ApiTheme, ApiChapter, ApiArticle } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from '../../components/simple-footer/simple-footer';
import { ArticleReader } from '../article-reader/article-reader';

@Component({
  selector: 'app-theme-detail',
  imports: [
    CardModule,
    ButtonModule,
    TreeModule,
    MiniHeader,
    SimpleFooter,
    ArticleReader,
    RouterOutlet
  ],
  templateUrl: './theme-detail.html',
  styleUrl: './theme-detail.css'
})
export class ThemeDetail implements OnInit {
  themeService = inject(Theme);
  route = inject(ActivatedRoute);
  router = inject(Router);

  theme: ApiTheme | undefined = undefined;
  selectedArticleId = signal<string | undefined>(undefined);
  loading = true;
  error: string | undefined = undefined;

  // 树形节点数据
  treeNodes: any[] = [];

  constructor() {}

  ngOnInit() {
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

  onNodeSelect(event: any) {
    const nodeData = event.node.data;
    if (nodeData.type === 'article') {
      // 使用路由导航，而不是组件嵌套
      this.router.navigate([`/theme/${this.theme?.id}/article`, nodeData.id]);
      this.selectedArticleId.set(nodeData.id);
    }
  }
}
