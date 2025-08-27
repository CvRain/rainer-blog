import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { HeaderComponent } from '../../components/header/header.component';
import { SimpleFooter } from '../../components/simple-footer/simple-footer';
import { RippleModule } from 'primeng/ripple';
import { User } from '../../services/user';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    DividerModule,
    RouterLink,
    MessageModule,
    HeaderComponent,
    SimpleFooter,
    RippleModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginError: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;

  userService = inject(User);
  router = inject(Router);
  route = inject(ActivatedRoute);
  returnUrl: string | null = null;

  ngOnInit() {
    // 获取 returnUrl 用于登录后跳转
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    // 检查是否存在token，如果存在则验证token有效性
    const token = localStorage.getItem('token');
    if (token) {
      this.loading = true;
      this.userService.verifyToken(token).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.code === 200) {
            // token有效，直接跳转到dashboard
            if (this.returnUrl) {
              this.router.navigateByUrl(this.returnUrl);
            } else {
              this.router.navigate(['/dashboard']);
            }
          } else {
            // token无效，清除本地存储的token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        },
        error: (error) => {
          this.loading = false;
          // token验证失败，清除本地存储的token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.error('Token验证失败:', error);
        }
      });
    }
  }

  onSubmit() {
    if (!this.username || !this.password) {
      return;
    }

    this.loading = true;
    this.loginError = false;
    this.errorMessage = '';

    this.userService.userLogin(this.username, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.code === 200 && response.data) {
          // 登录成功，保存token
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // 登录成功后跳转回来源页或 dashboard
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          // 登录失败
          this.loginError = true;
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.loginError = true;
        this.errorMessage = '登录请求失败，请稍后重试';
        console.error('登录失败:', error);
      }
    });
  }
}