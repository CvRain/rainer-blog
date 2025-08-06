import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiArticle } from '../../services/types';

@Component({
  selector: 'app-article-card',
  imports: [CardModule, ImageModule, DatePipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css'
})
export class ArticleCardComponent {
  article = input<ApiArticle | null>(null);
  
  constructor(private router: Router) {}
  
  onCardClick() {
    if (this.article()) {
      this.router.navigate(['/article', this.article()?.id]);
    }
  }
}