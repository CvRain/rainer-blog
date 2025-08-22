import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../services/user';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  userService = inject(User);
  router = inject(Router);

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
}