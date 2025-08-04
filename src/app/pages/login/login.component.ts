import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RippleModule } from 'primeng/ripple';

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
    FooterComponent,
    RippleModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  loginError: boolean = false;

  onSubmit() {
    console.log('Login attempt with:', {
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    });
    
    // 模拟登录验证
    if (this.username && this.password) {
      // 这里可以添加实际的登录逻辑
      // 模拟登录失败的情况
      this.loginError = true;
      setTimeout(() => {
        this.loginError = false;
      }, 3000);
    }
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}