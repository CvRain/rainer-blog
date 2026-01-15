import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ArticleReader } from './pages/article-reader/article-reader';
import { Archive } from './pages/archive/archive';
import { ThemeDetail } from './pages/theme-detail/theme-detail';
import { TestPageComponent } from './pages/test-page/test-page.component';
import { Dashboard } from './pages/dashboard/dashboard';
import { Overview } from './pages/dashboard/overview/overview';
import { Themes } from './pages/dashboard/themes/themes';
import { Resources } from './pages/dashboard/resources/resources';
import { Chapters } from './pages/dashboard/chapters/chapters';
import { ArticleEditor } from './pages/dashboard/articles/article-editor';
import { dashboardAuthGuard } from './pages/dashboard/dashboard-auth.guard';
import { Collection } from './services/collection';
import { CollectionsComponent } from './pages/dashboard/collections/collections.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'ClaudeRainer的博客小站',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: '用户登录 - ClaudeRainer的博客',
  },
  {
    path: 'dashboard',
    component: Dashboard,
    title: '控制台 - ClaudeRainer的博客',
    canActivate: [dashboardAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      { path: 'overview', component: Overview, title: '控制台 - 总览' },
      { path: 'themes', component: Themes, title: '控制台 - 主题管理' },
      { path: 'themes/new', component: Themes, title: '控制台 - 新建主题' },
      {
        path: 'themes/:themeId/chapters',
        component: Chapters,
        title: '控制台 - 章节管理',
      },
      {
        path: 'themes/:themeId/chapters/:chapterId',
        component: Chapters,
        title: '控制台 - 章节管理',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        title: '控制台 - 个人设置',
      },
      {
        path: 'articles/:id/edit',
        component: ArticleEditor,
        title: '控制台 - 文章编辑',
      },
      {
        path: 'articles/new',
        component: ArticleEditor,
        title: '控制台 - 新建文章',
      },
      { path: 'resources', component: Resources, title: '控制台 - 资源管理' },
      {
        path: 'resources/new',
        component: Resources,
        title: '控制台 - 新建集合',
      },
      {
        path: 'collections',
        component: CollectionsComponent,
        title: '控制台 - 集合管理',
      },
    ],
  },
  {
    path: 'article/:id',
    component: ArticleReader,
    title: '文章详情 - ClaudeRainer的博客',
  },
  {
    path: 'archive',
    component: Archive,
    title: '文章归档 - ClaudeRainer的博客',
  },
  {
    path: 'theme/:id',
    component: ThemeDetail,
    title: '主题详情 - ClaudeRainer的博客',
  },
  {
    path: 'theme/:id/article/:articleId',
    component: ThemeDetail,
    title: '主题详情 - ClaudeRainer的博客',
  },
  {
    path: 'test',
    component: TestPageComponent,
    title: '测试页面 - ClaudeRainer的博客',
  },
];
