import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { MiniHeader } from '../../../components/mini-header/mini-header';
import { SimpleFooter } from '../../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-chapter-management',
  imports: [
    CardModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    MiniHeader,
    SimpleFooter
  ],
  templateUrl: './chapter-management.html',
  styleUrl: './chapter-management.css'
})
export class ChapterManagement {
  router = inject(Router);

  // 示例章节数据
  chapters = [
    { id: 1, name: 'HTML基础', description: 'HTML基础知识', order: 1, themeId: 1, themeName: '前端开发', isActive: true, createdAt: '2025-01-01' },
    { id: 2, name: 'CSS样式', description: 'CSS样式设计', order: 2, themeId: 1, themeName: '前端开发', isActive: true, createdAt: '2025-01-02' },
    { id: 3, name: 'JavaScript核心', description: 'JavaScript语言特性', order: 3, themeId: 1, themeName: '前端开发', isActive: true, createdAt: '2025-01-03' },
    { id: 4, name: 'Node.js基础', description: 'Node.js运行环境', order: 1, themeId: 2, themeName: '后端架构', isActive: true, createdAt: '2025-01-04' }
  ];

  constructor() { }

  goToThemes() {
    this.router.navigate(['/dashboard/themes']);
  }

  goToChapters() {
    // 当前页面，无需跳转
  }

  goToArticles() {
    this.router.navigate(['/dashboard/articles']);
  }

  goToCollections() {
    this.router.navigate(['/dashboard/collections']);
  }

  goToResources() {
    this.router.navigate(['/dashboard/resources']);
  }

  createChapter() {
    // TODO: 实现创建章节逻辑
  }

  editChapter(chapter: any) {
    // TODO: 实现编辑章节逻辑
  }

  deleteChapter(chapter: any) {
    // TODO: 实现删除章节逻辑
  }

  refresh() {
    // TODO: 实现刷新逻辑
  }
}