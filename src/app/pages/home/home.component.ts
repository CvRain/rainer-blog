import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BlurCoverComponent } from '../../components/blur-cover/blur-cover.component';
import { HomeContentComponent } from '../../components/home-content/home-content.component';
import { UserInfo } from '../../services/types';
import { User } from '../../services/user';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    BlurCoverComponent,
    HomeContentComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  userService = inject(User);

  userInfo: UserInfo = {} as UserInfo;

  constructor() {
    const result = this.userService.getUserInfo();
    result.subscribe(res => {
      this.userInfo = res.data || {
        user_avatar: '',
        user_background: '',
        user_email: '',
        user_name: 'unknown',
        user_signature: 'unknown'
      };
      console.log(this.userInfo);
    });
  }
}
