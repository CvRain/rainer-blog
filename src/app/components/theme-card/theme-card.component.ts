import { Component, inject, input, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { Router } from '@angular/router';
import { BaseThemeSchema } from '../../services/types';
import { Theme } from '../../services/theme';
import { CoverService } from '../../services/cover.service';

@Component({
  selector: 'app-theme-card',
  imports: [ImageModule],
  templateUrl: './theme-card.component.html',
  styleUrl: './theme-card.component.css',
})
export class ThemeCardComponent implements OnInit {
  themeService = inject(Theme);
  coverService = inject(CoverService);

  theme = input<BaseThemeSchema>({
    id: '1145141919810',
    description: '',
    inserted_at: '',
    is_active: true,
    name: '默认主题',
    order: 0,
    updated_at: '',
  });

  coverUrl: string = 'images/theme-default-cover.jpg';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCover();
  }

  loadCover() {
    const themeId = this.theme().id;
    if (themeId && themeId !== '1145141919810') {
      this.coverService.getCoverUrl('theme', themeId).subscribe((url) => {
        if (url) {
          this.coverUrl = url;
        }
      });
    }
  }

  viewDetails() {
    // 导航到主题详情页面
    this.router.navigate(['/theme', this.theme().id]);
  }
}
