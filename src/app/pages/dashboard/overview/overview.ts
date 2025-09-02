import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { inject } from '@angular/core';
import { Article } from '../../../services/article';
import { ArticleCountData, TotalOverview } from '../../../services/types';
import { User } from '../../../services/user';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, CardModule, TagModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css'
})
export class Overview {
  private articleService = inject(Article);
  private userService = inject(User);

  totalView: TotalOverview = {} as TotalOverview;

  ngOnInit() {
    this.loadTotalOverview();
  }

  loadTotalOverview() {
    this.userService.totalOverview().subscribe({
      next: (response) => {
        this.totalView = response.data || {} as TotalOverview;
      },
      error: (error) => {
        console.error('获取总览失败:', error);
      }
    });
  }
}
