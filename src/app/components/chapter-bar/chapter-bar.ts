import {Component, input, output, signal} from '@angular/core';
import {ApiChapter, ApiArticle} from '../../services/types';
import {CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-chapter-bar',
  imports: [CommonModule, DatePipe],
  templateUrl: './chapter-bar.html',
  styleUrl: './chapter-bar.css'
})
export class ChapterBar {
  chapter = input<ApiChapter>({} as ApiChapter);
  articleSelected = output<ApiArticle>();

  isOpen = signal(true);

  toggleDropdown(): void {
    this.isOpen.update(value => !value);
  }

  onArticleSelect(article: ApiArticle): void {
    this.articleSelected.emit(article);
  }
}
