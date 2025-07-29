import { Component } from '@angular/core';
import { SelfIntroCardComponent } from '../self-intro-card/self-intro-card.component';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ThemeCardComponent } from '../theme-card/theme-card.component';
import { FriendLinkCardComponent } from '../friend-link-card/friend-link-card.component';

@Component({
  selector: 'app-home-content',
  imports: [
    SelfIntroCardComponent,
    ArticleCardComponent,
    ThemeCardComponent,
    FriendLinkCardComponent
  ],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent {

}