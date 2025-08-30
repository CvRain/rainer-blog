import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { inject } from '@angular/core';
import { Article } from '../../../services/article';
import { ArticleCountData } from '../../../services/types';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview {
  private articleService = inject(Article);

  totalView = {
    article_append_weekly: 0,
    article_count: 0,
    collection_append_weekly: 0,
    collection_count: 0,
    resource_append_weekly: 0,
    resource_count: 0,
    theme_append_weekly: 0,
    theme_count: 0
  };

  // 从 Article 服务获取的精确统计
  articleStats = {
    total: 0,
    weekly: 0
  };

  setTotalView(totalView: any) {
    if (totalView) {
      this.totalView = totalView;
    }
  }

  ngOnInit() {
    this.loadArticleStats();
  }

  loadArticleStats() {
    // 获取文章总数
    this.articleService.getArticleCount().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.articleStats.total = response.data.count;
        }
      },
      error: (error) => {
        console.error('获取文章统计失败:', error);
      }
    });

    // 获取本周新增文章数
    this.articleService.getArticleAppendCountWeekly().subscribe({
      next: (response) => {
        if (response.code === 200 && response.data) {
          this.articleStats.weekly = response.data.count;
        }
      },
      error: (error) => {
        console.error('获取本周文章统计失败:', error);
      }
    });
  }
}
