import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css',
})
export class CategoryCardComponent {
  categories = signal([
    { name: '前端开发', count: 12 },
    { name: '后端架构', count: 8 },
    { name: 'DevOps', count: 5 },
    { name: 'UI/UX设计', count: 3 },
    { name: '随笔杂谈', count: 7 },
  ]);
}
