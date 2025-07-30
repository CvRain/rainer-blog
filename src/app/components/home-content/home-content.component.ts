import { Component } from '@angular/core';
import { SelfIntroCardComponent } from '../self-intro-card/self-intro-card.component';
import { ArticleCardComponent } from '../article-card/article-card.component';
import { ThemeCardComponent } from '../theme-card/theme-card.component';
import { GalleryCard } from '../gallery-card/gallery-card';

@Component({
  selector: 'app-home-content',
  imports: [
    SelfIntroCardComponent,
    ArticleCardComponent,
    ThemeCardComponent,
    GalleryCard
  ],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})
export class HomeContentComponent {

}