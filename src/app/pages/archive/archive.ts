import {Component, inject} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MiniHeader} from '../../components/mini-header/mini-header';
import {SimpleFooter} from '../../components/simple-footer/simple-footer';
import {BlurCoverComponent} from "../../components/blur-cover/blur-cover.component";
import {ThemeCardComponent} from "../../components/theme-card/theme-card.component";
import {Theme} from '../../services/theme';
import {BaseThemeSchema} from '../../services/types';

@Component({
  selector: 'app-archive',
  imports: [
    RouterOutlet,
    MiniHeader,
    SimpleFooter,
    BlurCoverComponent,
    ThemeCardComponent
  ],
  templateUrl: './archive.html',
  styleUrl: './archive.css'
})
export class Archive {
  themeService = inject(Theme)
  themes: BaseThemeSchema[] = [] as BaseThemeSchema[];
  constructor() {
    const result = this.themeService.getActiveThemes();
    result.subscribe(res => {
      this.themes = res.data || [] as BaseThemeSchema[];
    });
  }
}
