import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Article } from '../../../services/article';
import { TotalOverview } from '../../../services/types';
import { User } from '../../../services/user';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {
  private userService = inject(User);

  totalView: TotalOverview = {
    article_count: 0,
    article_append_weekly: 0,
    theme_count: 0,
    theme_append_weekly: 0,
    resource_count: 0,
    resource_append_weekly: 0,
    collection_count: 0,
    collection_append_weekly: 0,
  } as TotalOverview;

  greeting = '你好';
  currentDate = new Date();

  ngOnInit() {
    this.updateGreeting();
    this.loadTotalOverview();
  }

  updateGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) this.greeting = '夜深了';
    else if (hour < 9) this.greeting = '早上好';
    else if (hour < 12) this.greeting = '上午好';
    else if (hour < 14) this.greeting = '中午好';
    else if (hour < 18) this.greeting = '下午好';
    else this.greeting = '晚上好';
  }

  loadTotalOverview() {
    this.userService.totalOverview().subscribe({
      next: (response) => {
        if (response.data) {
          this.totalView = response.data;
        }
      },
      error: (error) => {
        console.error('获取总览失败:', error);
      },
    });
  }
}
