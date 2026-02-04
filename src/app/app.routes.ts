import { Routes } from '@angular/router';
import { dashboardAuthGuard } from './pages/dashboard/dashboard-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'ClaudeRainer的博客小站',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: '用户登录 - ClaudeRainer的博客',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: '控制台 - ClaudeRainer的博客',
    canActivate: [dashboardAuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview').then((m) => m.Overview),
        title: '控制台 - 总览',
      },
      {
        path: 'themes',
        loadComponent: () =>
          import('./pages/dashboard/themes/themes').then((m) => m.Themes),
        title: '控制台 - 主题管理',
      },
      {
        path: 'themes/new',
        loadComponent: () =>
          import('./pages/dashboard/themes/themes').then((m) => m.Themes),
        title: '控制台 - 新建主题',
      },
      {
        path: 'themes/:themeId/chapters',
        loadComponent: () =>
          import('./pages/dashboard/chapters/chapters').then((m) => m.Chapters),
        title: '控制台 - 章节管理',
      },
      {
        path: 'themes/:themeId/chapters/:chapterId',
        loadComponent: () =>
          import('./pages/dashboard/chapters/chapters').then((m) => m.Chapters),
        title: '控制台 - 章节管理',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/dashboard/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
        title: '控制台 - 个人设置',
      },
      {
        path: 'articles/:id/edit',
        loadComponent: () =>
          import('./pages/dashboard/articles/article-editor').then(
            (m) => m.ArticleEditor,
          ),
        title: '控制台 - 文章编辑',
      },
      {
        path: 'articles/new',
        loadComponent: () =>
          import('./pages/dashboard/articles/article-editor').then(
            (m) => m.ArticleEditor,
          ),
        title: '控制台 - 新建文章',
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./pages/dashboard/resources/resources').then(
            (m) => m.Resources,
          ),
        title: '控制台 - 资源管理',
      },
      {
        path: 'resources/new',
        loadComponent: () =>
          import('./pages/dashboard/resources/resources').then(
            (m) => m.Resources,
          ),
        title: '控制台 - 新建集合',
      },
      {
        path: 'collections',
        loadComponent: () =>
          import('./pages/dashboard/collections/collections.component').then(
            (m) => m.CollectionsComponent,
          ),
        title: '控制台 - 集合管理',
      },
    ],
  },
  {
    path: 'article/:id',
    loadComponent: () =>
      import('./pages/article-reader/article-reader').then(
        (m) => m.ArticleReader,
      ),
    title: '文章详情 - ClaudeRainer的博客',
  },
  {
    path: 'archive',
    loadComponent: () =>
      import('./pages/archive/archive').then((m) => m.Archive),
    title: '文章归档 - ClaudeRainer的博客',
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./pages/category/category').then((m) => m.Category),
    title: '分类 - ClaudeRainer的博客',
  },
  {
    path: 'theme/:id',
    loadComponent: () =>
      import('./pages/theme-detail/theme-detail').then((m) => m.ThemeDetail),
    title: '主题详情 - ClaudeRainer的博客',
  },
  {
    path: 'theme/:id/article/:articleId',
    loadComponent: () =>
      import('./pages/theme-detail/theme-detail').then((m) => m.ThemeDetail),
    title: '主题详情 - ClaudeRainer的博客',
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./pages/test-page/test-page.component').then(
        (m) => m.TestPageComponent,
      ),
    title: '测试页面 - ClaudeRainer的博客',
  },
];
