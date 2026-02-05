import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MiniHeader } from '../../components/mini-header/mini-header';
import { SimpleFooter } from '../../components/simple-footer/simple-footer';
import { BlurCoverComponent } from '../../components/blur-cover/blur-cover.component';
import { Article } from '../../services/article';
import { ApiArticle } from '../../services/types';

interface TagGroup {
  name: string;
  color: string;
  count: number;
  articles: ApiArticle[];
  x: number;
  y: number;
}

@Component({
  selector: 'app-category',
  imports: [
    RouterOutlet,
    CommonModule,
    DatePipe,
    MiniHeader,
    SimpleFooter,
    BlurCoverComponent,
  ],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  private articleService = inject(Article);
  private router = inject(Router);

  isLoading = true;
  tags: TagGroup[] = [];
  selectedTag: TagGroup | null = null;

  private readonly fallbackTags = [
    'Angular',
    'TailwindCSS',
    'TypeScript',
    'Node.js',
    'Docker',
    'Git',
    'Design',
    'Life',
  ];

  private readonly tagPalette = [
    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300',
    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300',
    'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
    'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  ];

  constructor() {
    this.loadArticles();
  }

  selectTag(tag: TagGroup) {
    this.selectedTag = tag;
  }

  openArticle(article: ApiArticle) {
    if (article?.id) {
      this.router.navigate(['/article', article.id]);
    }
  }

  private loadArticles() {
    this.articleService.getPublicArticleList(1, 200).subscribe({
      next: (response) => {
        const articles = response.data ?? [];
        this.tags = this.buildTags(articles);
        this.selectedTag = this.tags.length > 0 ? this.tags[0] : null;
        this.isLoading = false;
      },
      error: () => {
        this.tags = this.buildTags([]);
        this.selectedTag = this.tags.length > 0 ? this.tags[0] : null;
        this.isLoading = false;
      },
    });
  }

  private buildTags(articles: ApiArticle[]): TagGroup[] {
    const tagMap = new Map<string, ApiArticle[]>();
    for (const article of articles) {
      const tags = this.extractTags(article);
      for (const tag of tags) {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)?.push(article);
      }
    }

    const sourceTags: Array<[string, ApiArticle[]]> = tagMap.size
      ? Array.from(tagMap.entries())
      : this.fallbackTags.map(
          (name) => [name, [] as ApiArticle[]] as [string, ApiArticle[]],
        );

    const total = sourceTags.length;
    const maxRadius =
      total > 24 ? 260 : total > 16 ? 230 : total > 10 ? 200 : 170;
    const minRadius = 70;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    return sourceTags.map(([name, items], index) => {
      const ratio = total <= 1 ? 1 : (index + 1) / total;
      const radius = minRadius + (maxRadius - minRadius) * Math.sqrt(ratio);
      const angle = index * goldenAngle;
      const jitter = (index % 2 === 0 ? 1 : -1) * 6;
      const x = Math.cos(angle) * (radius + jitter);
      const y = Math.sin(angle) * (radius - jitter);
      return {
        name,
        color: this.tagPalette[index % this.tagPalette.length],
        count: items.length,
        articles: items,
        x,
        y,
      };
    });
  }

  private extractTags(article: ApiArticle): string[] {
    const raw = article?.['tags'] ?? article?.['tag'] ?? article?.['labels'];
    if (Array.isArray(raw)) {
      return raw
        .map((item) =>
          typeof item === 'string'
            ? item.trim()
            : typeof item?.name === 'string'
              ? item.name.trim()
              : '',
        )
        .filter((item) => item.length > 0);
    }
    if (typeof raw === 'string') {
      return raw
        .split(/[,，、]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    return [];
  }
}
