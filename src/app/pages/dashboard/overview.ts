import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'dashboard-overview',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  template: `
    <div class="grid grid-cols-12 gap-4">
      <p-card class="col-span-12 md:col-span-4">
        <ng-template pTemplate="title">文章统计</ng-template>
        <div class="text-3xl font-semibold">--</div>
        <p-tag value="Articles" severity="info" class="mt-2"></p-tag>
      </p-card>
      <p-card class="col-span-12 md:col-span-4">
        <ng-template pTemplate="title">章节统计</ng-template>
        <div class="text-3xl font-semibold">--</div>
        <p-tag value="Chapters" severity="success" class="mt-2"></p-tag>
      </p-card>
      <p-card class="col-span-12 md:col-span-4">
        <ng-template pTemplate="title">主题统计</ng-template>
        <div class="text-3xl font-semibold">--</div>
        <p-tag value="Themes" severity="warning" class="mt-2"></p-tag>
      </p-card>
      <p-card class="col-span-12">
        <ng-template pTemplate="title">最近更新</ng-template>
        <div class="text-muted-color">后续接入服务数据...</div>
      </p-card>
    </div>
  `,
})
export class DashboardOverview {}


