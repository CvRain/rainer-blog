import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ArticleReader } from './pages/article-reader/article-reader';
import { Archive } from './pages/archive/archive';

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
    path: 'article/:id',
    component: ArticleReader,
    title: "文章详情 - ClaudeRainer的博客"
  },
  {
    path: 'archive',
    component: Archive,
    title: "文章归档 - ClaudeRainer的博客"
  }
];