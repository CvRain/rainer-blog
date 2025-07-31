import { Component, input, Input, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { BingImageService } from '../../services/image';

export interface SocialLink {
  url: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-blur-cover',
  imports: [
    ImageModule
  ],
  templateUrl: './blur-cover.component.html',
  styleUrl: './blur-cover.component.css'
})
export class BlurCoverComponent implements OnInit {
  imageUrl = input('images/placeholder.jpg');
  title = input('欢迎来到我的博客');
  description = input('这里是展示技术分享和思考的地方');
  socialLinks = input([
    { url: 'https://github.com', icon: 'pi-github', label: 'GitHub' },
    { url: 'https://gitlab.com', icon: 'pi-code', label: 'GitLab' },
    { url: 'https://bilibili.com', icon: 'pi-video', label: 'Bilibili' }
  ]);
  showScrollIndicator = input(true);
  
  currentImageUrl: string = 'images/placeholder.jpg';

  constructor(private bingImageService: BingImageService) {}

  ngOnInit() {
    this.loadBingDailyImage();
  }

  loadBingDailyImage() {
    this.bingImageService.getBingDailyImageUrl().subscribe({
      next: (imageUrl) => {
        this.currentImageUrl = imageUrl;
      },
      error: (error) => {
        console.error('获取必应每日一图失败:', error);
        // 如果获取失败，使用默认图片
        this.currentImageUrl = this.imageUrl();
      }
    });
  }
}