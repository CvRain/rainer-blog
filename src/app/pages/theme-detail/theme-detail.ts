import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Theme } from '../../services/theme';
import { ApiTheme, ApiChapter, ApiArticle } from '../../services/types';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from '../../components/simple-footer/simple-footer';
import { ArticleReader } from '../article-reader/article-reader';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-theme-detail',
  imports: [
    CardModule,
    ButtonModule,
    TreeModule,
    MiniHeader,
    SimpleFooter,
    RouterOutlet,
    ArticleReader
  ],
  templateUrl: './theme-detail.html',
  styleUrl: './theme-detail.css'
})
export class ThemeDetail implements OnInit {
  themeService = inject(Theme);
  route = inject(ActivatedRoute);

  theme: ApiTheme | undefined = undefined;
  selectedArticle: ApiArticle | undefined = undefined;
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
      this.selectedArticle = nodeData.article;
    }
  }
}
