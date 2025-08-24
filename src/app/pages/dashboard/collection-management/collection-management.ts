import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { MiniHeader } from '../../../components/mini-header/mini-header';
import { SimpleFooter } from '../../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-collection-management',
  imports: [
    CardModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    MiniHeader,
    SimpleFooter
  ],
  templateUrl: './collection-management.html',
  styleUrl: './collection-management.css'
})
export class CollectionManagement {
  router = inject(Router);

  // 示例集合数据
  collections = [
    { id: 1, name: '前端资源包', description: '前端开发相关资源', order: 1, isActive: true, createdAt: '2025-01-01' },
    { id: 2, name: '后端资源包', description: '后端开发相关资源', order: 2, isActive: true, createdAt: '2025-01-02' },
    { id: 3, name: '设计资源包', description: 'UI设计相关资源', order: 3, isActive: true, createdAt: '2025-01-03' },
    { id: 4, name: '文档资源包', description: '技术文档集合', order: 4, isActive: false, createdAt: '2025-01-04' }
  ];

  constructor() { }

  goToThemes() {
    this.router.navigate(['/dashboard/themes']);
  }

  goToChapters() {
    this.router.navigate(['/dashboard/chapters']);
  }

  goToArticles() {
    this.router.navigate(['/dashboard/articles']);
  }

  goToCollections() {
    // 当前页面，无需跳转
  }

  goToResources() {
    this.router.navigate(['/dashboard/resources']);
  }

  createCollection() {
    // TODO: 实现创建集合逻辑
  }

  editCollection(collection: any) {
    // TODO: 实现编辑集合逻辑
  }

  deleteCollection(collection: any) {
    // TODO: 实现删除集合逻辑
  }

  refresh() {
    // TODO: 实现刷新逻辑
  }
}