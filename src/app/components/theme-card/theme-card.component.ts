import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import {BaseThemeSchema} from '../../services/types';

@Component({
  selector: 'app-theme-card',
  imports: [CardModule, ButtonModule, ImageModule],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.css'
})
export class ThemeCardComponent {
  theme = input<BaseThemeSchema>({
    id: "1145141919810",
    description: "",
    inserted_at: "",
    is_active: true,
    name: "默认主题",
    order: 0,
    updated_at: ""
  });

  constructor(private router: Router) {}

  viewDetails() {
    // 导航到主题详情页面
    this.router.navigate(['/theme', this.theme().id]);
  }
}
