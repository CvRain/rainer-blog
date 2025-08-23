import { Component, inject, OnInit, Pipe } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { User } from '../../services/user';
import { Theme } from '../../services/theme';
import { Article } from '../../services/article';
import { Resource } from '../../services/resource';
import { Collection } from '../../services/collection';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import {TotalOverview} from '../../services/types';
import {SimpleFooter} from '../../components/simple-footer/simple-footer';
import {MiniHeader} from '../../components/mini-header/mini-header';

@Component({
  selector: 'app-dashboard',
  imports: [
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    PanelModule,
    DatePipe,
    SimpleFooter,
    MiniHeader
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userService = inject(User);
  router = inject(Router);
  themeService = inject(Theme);
  articleService = inject(Article);
  resourceService = inject(Resource);
  collectionService = inject(Collection);

  totalOverview: TotalOverview | undefined = {} as TotalOverview;

  // 最近新增数据
  recentThemes: any[] = [
    { id: '1', name: '前端开发', description: '关于前端技术的分享', inserted_at: '2025-08-20T10:00:00Z' },
    { id: '2', name: '后端架构', description: '服务端设计与实现', inserted_at: '2025-08-18T14:30:00Z' },
    { id: '3', name: '移动开发', description: '移动端应用开发经验', inserted_at: '2025-08-15T09:15:00Z' },
    { id: '4', name: '数据库优化', description: '数据库性能调优', inserted_at: '2025-08-12T16:45:00Z' },
    { id: '5', name: 'DevOps实践', description: '持续集成与部署', inserted_at: '2025-08-10T11:20:00Z' }
  ];

  recentArticles: any[] = [
    { id: '1', title: 'Angular 18新特性解析', subtitle: '深入了解最新版本的变化', inserted_at: '2025-08-21T08:30:00Z' },
    { id: '2', title: 'React Hooks最佳实践', subtitle: '提升函数组件的能力', inserted_at: '2025-08-19T13:45:00Z' },
    { id: '3', title: 'Vue 3状态管理', subtitle: 'Pinia的使用指南', inserted_at: '2025-08-17T15:20:00Z' },
    { id: '4', title: 'Node.js性能优化', subtitle: '服务端性能调优技巧', inserted_at: '2025-08-14T10:10:00Z' },
    { id: '5', title: '微服务架构设计', subtitle: '构建可扩展的系统', inserted_at: '2025-08-11T17:55:00Z' }
  ];

  recentResources: any[] = [
    { id: '1', name: '设计资源包', description: 'UI组件和图标集合', inserted_at: '2025-08-20T12:00:00Z' },
    { id: '2', name: '代码模板库', description: '常用代码片段整理', inserted_at: '2025-08-18T09:30:00Z' },
    { id: '3', name: '技术文档集', description: '各类技术规范文档', inserted_at: '2025-08-16T14:15:00Z' },
    { id: '4', name: '学习视频集', description: '技术分享视频整理', inserted_at: '2025-08-13T11:45:00Z' },
    { id: '5', name: '开源项目集合', description: '优秀开源项目推荐', inserted_at: '2025-08-11T16:25:00Z' }
  ];

  recentCollections: any[] = [
    { id: '1', name: '前端框架对比', description: '主流框架特性分析', inserted_at: '2025-08-19T10:20:00Z' },
    { id: '2', name: '数据库选型指南', description: '不同场景下的选择建议', inserted_at: '2025-08-17T13:50:00Z' },
    { id: '3', name: '云服务厂商对比', description: 'AWS、Azure、阿里云等对比', inserted_at: '2025-08-15T15:30:00Z' },
    { id: '4', name: '开发工具推荐', description: '提升开发效率的工具', inserted_at: '2025-08-12T09:40:00Z' },
    { id: '5', name: '面试题库整理', description: '技术面试常见问题', inserted_at: '2025-08-10T14:10:00Z' }
  ];

  // 图表数据
  themeChartData: any;
  articleChartData: any;

  ngOnInit() {
    // 检查token是否存在且有效
    const token = localStorage.getItem('token');
    if (!token) {
      // 没有token，跳转到登录页面
      this.router.navigate(['/login']);
      return;
    }

    // 验证token有效性
    this.userService.verifyToken(token).subscribe({
      next: (response) => {
        if (response.code !== 200) {
          // token无效，清除本地存储并跳转到登录页面
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        } else {
          // token有效，加载dashboard数据
          this.loadDashboardData();
        }
      },
      error: (error) => {
        // token验证失败，清除本地存储并跳转到登录页面
        console.error('Token验证失败:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }

  loadDashboardData() {
    // 加载统计数据（使用假数据）
    this.userService.totalOverview().subscribe({
      next: (response) => {
        if (response.code !== 200) {
          console.error('获取统计数据失败:', response.message);
          return;
        }
        this.totalOverview = response.data;
        console.log('统计数据:', response.data);
      },
      error: (error) => {
        console.error('获取统计数据失败:', error);
      }
    });

    // 加载最近新增数据（使用假数据）
    // this.loadRecentData();

    // 初始化图表数据
    this.initCharts();
  }



  initCharts() {
    // 初始化主题图表数据
    this.themeChartData = {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
      datasets: [
        {
          label: '新增主题',
          data: [5, 5, 3, 8, 6, 9],
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    };

    // 初始化文章图表数据
    this.articleChartData = {
      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
      datasets: [
        {
          label: '新增文章',
          data: [28, 32, 25, 38, 45, 50],
          fill: false,
          borderColor: '#5e72e4'
        }
      ]
    };
  }

  // 导航到不同管理页面
  goToThemes() {
    // TODO: 实现导航到主题管理页面
  }

  goToArticles() {
    // TODO: 实现导航到文章管理页面
  }

  goToResources() {
    // TODO: 实现导航到资源管理页面
  }

  goToCollections() {
    // TODO: 实现导航到集合管理页面
  }
}
