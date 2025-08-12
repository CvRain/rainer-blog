import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {MiniHeader} from '../../components/mini-header/mini-header';
import {SimpleFooter} from '../../components/simple-footer/simple-footer';
import {BlurCoverComponent} from "../../components/blur-cover/blur-cover.component";
import {ThemeCardComponent, ThemeData} from "../../components/theme-card/theme-card.component";

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
  themes: ThemeData[] = [
    {
      id: 1,
      title: 'Angular开发',
      description: '深入探讨Angular框架的核心概念和高级技巧，包括组件、服务、路由和状态管理等。',
      articleCount: 12,
      lastUpdated: '2024-07-15',
      coverImage: 'images/angular-cover.jpg'
    },
    {
      id: 2,
      title: 'TypeScript进阶',
      description: 'TypeScript的高级特性详解，包括泛型、装饰器、映射类型等，帮助你写出更健壮的代码。',
      articleCount: 8,
      lastUpdated: '2024-06-23',
      coverImage: 'images/typescript-cover.jpg'
    },
    {
      id: 3,
      title: '前端性能优化',
      description: '前端性能优化的各个方面，包括加载优化、渲染优化、资源压缩等实用技巧。',
      articleCount: 15,
      lastUpdated: '2024-07-28',
      coverImage: 'images/performance-cover.jpg'
    },
    {
      id: 4,
      title: '响应式设计',
      description: '响应式设计原理和实践，包括Flexbox、Grid布局以及移动端适配的最佳实践。',
      articleCount: 10,
      lastUpdated: '2024-05-30',
      coverImage: 'images/responsive-cover.jpg'
    }
  ];
}