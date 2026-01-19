import { Component, input, inject, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { DatePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiArticle } from '../../services/types';
import { CoverService } from '../../services/cover.service';
import { Chapter } from '../../services/chapter';
import { switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-article-card',
  imports: [ImageModule, DatePipe, CommonModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css',
})
export class ArticleCardComponent implements OnInit {
  article = input<ApiArticle | null>(null);
  coverUrl: string = 'images/article-default-cover.jpg';

  private coverService = inject(CoverService);
  private chapterService = inject(Chapter);
  private router = inject(Router);

  ngOnInit() {
    this.loadCoverRefined();
  }

  // Refined logic with what we have
  loadCoverRefined() {
    const info = this.article();
    if (!info) return;

    this.coverService
      .getCoverUrl('article', info.id)
      .pipe(
        switchMap((url) => {
          if (url) return of(url);
          if (info.chapter_id) {
            return this.coverService.getCoverUrl('chapter', info.chapter_id);
          }
          return of(null);
        }),
        catchError(() => of(null)),
      )
      .subscribe((url) => {
        if (url) {
          this.coverUrl = url;
        }
      });
  }

  onCardClick() {
    if (this.article()) {
      this.router.navigate(['/article', this.article()?.id]);
    }
  }
}
