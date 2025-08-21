import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RouterLink, Router } from '@angular/router';
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
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginError: boolean = false;
  errorMessage: string = '';
  loading: boolean = false;

  userService = inject(User);
  router = inject(Router);

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
          
          // 跳转到dashboard页面
          this.router.navigate(['/dashboard']);
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