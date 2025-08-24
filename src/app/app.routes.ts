import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ArticleReader } from './pages/article-reader/article-reader';
import { Archive } from './pages/archive/archive';
import { ThemeDetail } from './pages/theme-detail/theme-detail';
import {TestPageComponent} from './pages/test-page/test-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ThemeManagement } from './pages/dashboard/theme-management/theme-management';
import { ChapterManagement } from './pages/dashboard/chapter-management/chapter-management';
import { ArticleManagement } from './pages/dashboard/article-management/article-management';
import { CollectionManagement } from './pages/dashboard/collection-management/collection-management';
import { ResourceManagement } from './pages/dashboard/resource-management/resource-management';

export const routes: Routes = [
  {
    path:'',
    component: HomeComponent,
    title: "ClaudeRainer的博客小站"
  },
  {
    path: 'login',
    component: LoginComponent,
    title: "用户登录 - ClaudeRainer的博客"
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: "控制台 - ClaudeRainer的博客"
  },
  {
    path: 'dashboard/themes',
    component: ThemeManagement,
    title: "主题管理 - 控制台"
  },
  {
    path: 'dashboard/chapters',
    component: ChapterManagement,
    title: "章节管理 - 控制台"
  },
  {
    path: 'dashboard/articles',
    component: ArticleManagement,
    title: "文章管理 - 控制台"
  },
  {
    path: 'dashboard/collections',
    component: CollectionManagement,
    title: "集合管理 - 控制台"
  },
  {
    path: 'dashboard/resources',
    component: ResourceManagement,
    title: "资源管理 - 控制台"
  },
  {
    path: 'article/:id',
    component: ArticleReader,
    title: "文章详情 - ClaudeRainer的博客"
  },
  {
    path: 'archive',
    component: Archive,
    title: "文章归档 - ClaudeRainer的博客"
  },
  {
    path: 'theme/:id',
    component: ThemeDetail,
    title: "主题详情 - ClaudeRainer的博客"
  },
  {
    path: 'theme/:id/article/:articleId',
    component: ThemeDetail,
    title: "主题详情 - ClaudeRainer的博客"
  },
  {
    path: 'test',
    component: TestPageComponent,
    title: "测试页面 - ClaudeRainer的博客"
  }
];