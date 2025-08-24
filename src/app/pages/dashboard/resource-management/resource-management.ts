import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { MiniHeader } from '../../../components/mini-header/mini-header';
import { SimpleFooter } from '../../../components/simple-footer/simple-footer';

@Component({
  selector: 'app-resource-management',
  imports: [
    CardModule,
    ButtonModule,
    ToolbarModule,
    TableModule,
    MiniHeader,
    SimpleFooter
  ],
  templateUrl: './resource-management.html',
  styleUrl: './resource-management.css'
})
export class ResourceManagement {
  router = inject(Router);

  // 示例资源数据
  resources = [
    { id: 1, name: 'Angular Logo', description: 'Angular框架Logo图片', collectionId: 1, collectionName: '前端资源包', type: 'image/png', size: '12KB', createdAt: '2025-01-01' },
    { id: 2, name: 'React Logo', description: 'React框架Logo图片', collectionId: 1, collectionName: '前端资源包', type: 'image/svg', size: '8KB', createdAt: '2025-01-02' },
    { id: 3, name: 'Vue Logo', description: 'Vue框架Logo图片', collectionId: 1, collectionName: '前端资源包', type: 'image/svg', size: '5KB', createdAt: '2025-01-03' },
    { id: 4, name: 'Node Logo', description: 'Node.js Logo图片', collectionId: 2, collectionName: '后端资源包', type: 'image/png', size: '10KB', createdAt: '2025-01-04' }
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
    this.router.navigate(['/dashboard/collections']);
  }

  goToResources() {
    // 当前页面，无需跳转
  }

  createResource() {
    // TODO: 实现创建资源逻辑
  }

  editResource(resource: any) {
    // TODO: 实现编辑资源逻辑
  }

  deleteResource(resource: any) {
    // TODO: 实现删除资源逻辑
  }

  refresh() {
    // TODO: 实现刷新逻辑
  }
}