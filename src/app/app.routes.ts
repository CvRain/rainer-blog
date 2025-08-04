import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

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
  }
];