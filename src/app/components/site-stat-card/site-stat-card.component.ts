import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-site-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './site-stat-card.component.html',
  styleUrl: './site-stat-card.component.css',
})
export class SiteStatCardComponent {
  stats = signal([
    {
      label: '文章总数',
      value: '42',
      icon: 'pi pi-book',
      color: 'text-blue-500',
    },
    {
      label: '访问人次',
      value: '12,580',
      icon: 'pi pi-users',
      color: 'text-green-500',
    },
    {
      label: '运行天数',
      value: '365',
      icon: 'pi pi-clock',
      color: 'text-orange-500',
    },
    {
      label: '最后更新',
      value: '2天前',
      icon: 'pi pi-calendar-plus',
      color: 'text-purple-500',
    },
  ]);
}
