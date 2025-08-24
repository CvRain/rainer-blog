import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { MiniHeader } from '../../../components/mini-header/mini-header';
import { SimpleFooter } from '../../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-theme-management',
  imports: [
    CardModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    MiniHeader,
    SimpleFooter
  ],
  templateUrl: './theme-management.html',
  styleUrl: './theme-management.css'
})
export class ThemeManagement {
  router = inject(Router);

  // 示例主题数据
  themes = [
    { id: 1, name: '前端开发', description: '关于前端技术的分享', order: 1, isActive: true, createdAt: '2025-01-01' },
    { id: 2, name: '后端架构', description: '服务端设计与实现', order: 2, isActive: true, createdAt: '2025-01-02' },
    { id: 3, name: '移动开发', description: '移动端应用开发经验', order: 3, isActive: false, createdAt: '2025-01-03' },
    { id: 4, name: '数据库优化', description: '数据库性能调优', order: 4, isActive: true, createdAt: '2025-01-04' }
  ];

  constructor() { }

  goToThemes() {
    // 当前页面，无需跳转
  }

  goToChapters() {
    this.router.navigate(['/dashboard/chapters']);
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

  createTheme() {
    // TODO: 实现创建主题逻辑
  }

  editTheme(theme: any) {
    // TODO: 实现编辑主题逻辑
  }

  deleteTheme(theme: any) {
    // TODO: 实现删除主题逻辑
  }

  refresh() {
    // TODO: 实现刷新逻辑
  }
}