import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';

export interface ThemeData {
  id: number;
  title: string;
  description: string;
  articleCount: number;
  lastUpdated: string;
  coverImage: string;
}

@Component({
  selector: 'app-theme-card',
  imports: [CardModule, ButtonModule, ImageModule],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.css'
})
export class ThemeCardComponent {
  theme = input<ThemeData>({
    id: 1,
    title: '默认主题',
    description: '这里是主题的简短描述，用于介绍主题的主要内容和特点。可以包含一些关键信息，帮助用户快速了解这个主题。',
    articleCount: 15,
    lastUpdated: '2024-01-01',
    coverImage: 'images/theme-default-cover.jpg'
  });

  constructor(private router: Router) {}

  viewDetails() {
    // 导航到主题详情页面
    this.router.navigate(['/theme', this.theme().id]);
  }
}