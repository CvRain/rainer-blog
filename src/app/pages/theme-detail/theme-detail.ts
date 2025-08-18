import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Theme} from '../../services/theme';
import {ApiTheme, ApiChapter, ApiArticle} from '../../services/types';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {TreeModule} from 'primeng/tree';
import {MiniHeader} from '../../components/mini-header/mini-header';
import {FooterComponent} from '../../components/footer/footer.component';
import {BlurCoverComponent} from '../../components/blur-cover/blur-cover.component';
import {ChapterBar} from '../../components/chapter-bar/chapter-bar';
import {HeaderComponent} from '../../components/header/header.component';

@Component({
  selector: 'app-theme-detail',
  imports: [
    CardModule,
    ButtonModule,
    TreeModule,
    FooterComponent,
    BlurCoverComponent,
    ChapterBar,
    HeaderComponent
  ],
  templateUrl: './theme-detail.html',
  styleUrl: './theme-detail.css'
})
export class ThemeDetail implements OnInit {

  themeService = inject(Theme);
  route = inject(ActivatedRoute);
  router = inject(Router);

  theme: ApiTheme = {} as ApiTheme;

  ngOnInit(): void {
    const themeId = this.route.snapshot.paramMap.get('id');
    if(!themeId){
      return
    }
    const getThemeResult = this.themeService.getThemeWithDetail(themeId);
    getThemeResult.subscribe(res => {
      this.theme = res.data || {} as ApiTheme;
      console.log(this.theme);
    });
  }

  onArticleSelected(article: ApiArticle): void {
    this.router.navigate(['/article', article.id], {
      state: { theme: this.theme }
    });
  }

}