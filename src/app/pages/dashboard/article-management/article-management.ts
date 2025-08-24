import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { MiniHeader } from '../../../components/mini-header/mini-header';
import { SimpleFooter } from '../../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-article-management',
  imports: [
    CardModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    MiniHeader,
    SimpleFooter
  ],
  templateUrl: './article-management.html',
  styleUrl: './article-management.css'
})
export class ArticleManagement {
  router = inject(Router);

  // 示例文章数据
  articles = [
    { id: 1, title: 'HTML基础语法', subtitle: '学习HTML基本标签', order: 1, chapterId: 1, chapterName: 'HTML基础', isActive: true, createdAt: '2025-01-01' },
    { id: 2, title: 'CSS选择器', subtitle: '掌握CSS选择器用法', order: 2, chapterId: 2, chapterName: 'CSS样式', isActive: true, createdAt: '2025-01-02' },
    { id: 3, title: 'JavaScript变量', subtitle: '理解JavaScript变量声明', order: 1, chapterId: 3, chapterName: 'JavaScript核心', isActive: true, createdAt: '2025-01-03' },
    { id: 4, title: 'Node.js模块系统', subtitle: '学习Node.js模块机制', order: 1, chapterId: 4, chapterName: 'Node.js基础', isActive: true, createdAt: '2025-01-04' }
  ];

  constructor() { }

  goToThemes() {
    this.router.navigate(['/dashboard/themes']);
  }

  goToChapters() {
    this.router.navigate(['/dashboard/chapters']);
  }

  goToArticles() {
    // 当前页面，无需跳转
  }

  goToCollections() {
    this.router.navigate(['/dashboard/collections']);
  }

  goToResources() {
    this.router.navigate(['/dashboard/resources']);
  }

  createArticle() {
    // TODO: 实现创建文章逻辑
  }

  editArticle(article: any) {
    // TODO: 实现编辑文章逻辑
  }

  deleteArticle(article: any) {
    // TODO: 实现删除文章逻辑
  }

  refresh() {
    // TODO: 实现刷新逻辑
  }
}