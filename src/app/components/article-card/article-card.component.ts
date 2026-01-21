import {
  Component,
  input,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ImageModule } from 'primeng/image';
import { DatePipe, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiArticle } from '../../services/types';
import { CoverService } from '../../services/cover.service';
import { Chapter } from '../../services/chapter';
import { switchMap, of, catchError, map } from 'rxjs';

@Component({
  selector: 'app-article-card',
  imports: [ImageModule, DatePipe, CommonModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCardComponent {
  article = input<ApiArticle | null>(null);

  private coverService = inject(CoverService);
  private router = inject(Router);

  coverUrl = toSignal(
    toObservable(this.article).pipe(
      switchMap((info) => {
        if (!info) return of(null);
        return this.coverService.getCoverUrl('article', info.id).pipe(
          switchMap((url) => {
            if (url) return of(url);
            if (info.chapter_id) {
              return this.coverService.getCoverUrl('chapter', info.chapter_id);
            }
            return of(null);
          }),
          catchError(() => of(null)),
        );
      }),
      map((url) => url || 'images/article-default-cover.jpg'),
    ),
    { initialValue: 'images/article-default-cover.jpg' },
  );

  onCardClick() {
    if (this.article()) {
      this.router.navigate(['/article', this.article()?.id]);
    }
  }
}
