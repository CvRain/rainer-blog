import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MiniHeader} from '../../components/mini-header/mini-header';
import {SimpleFooter} from '../../components/simple-footer/simple-footer';
import {ArticleSidebar} from '../../components/article-sidebar/article-sidebar';
import {Theme} from '../../services/theme';
import {ApiTheme} from '../../services/types';

@Component({
  selector: 'app-test-page',
  imports: [
    CommonModule,
    MiniHeader,
    SimpleFooter,
    ArticleSidebar
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})

export class TestPageComponent {
  themeService = inject(Theme);
  theme: ApiTheme | undefined = undefined;

  ngOnInit(): void {
    const themeId = "6a85e180-a159-4b3c-89b9-99be1c6f6b21"
    if (!themeId) {
      return
    }
    const getThemeResult = this.themeService.getThemeWithDetail(themeId);
    getThemeResult.subscribe(res => {
      this.theme = res.data || undefined;
      console.log('TestPageComponent 获取到的主题数据:', this.theme);
      console.log('TestPageComponent chapters:', this.theme?.chapters);
    });
  }
}