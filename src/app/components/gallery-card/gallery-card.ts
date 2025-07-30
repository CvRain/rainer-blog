import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  full: string;
}

@Component({
  selector: 'app-gallery-card',
  imports: [CardModule],
  templateUrl: './gallery-card.html',
  styleUrl: './gallery-card.css'
})
export class GalleryCard {
  images: GalleryImage[] = [
    {
      id: 1,
      title: '山水风景',
      description: '美丽的山水风景照片',
      full: 'images/gallery-default-1.jpg'
    },
    {
      id: 2,
      title: '城市夜景',
      description: '东方明珠会不会变成防御塔',
      full: 'images/gallery-default-2.jpg'
    },
    {
      id: 3,
      title: '自然风光',
      description: '住在山里真不错',
      full: 'images/gallery-default-3.jpg'
    },
    {
      id: 4,
      title: '雨后世界',
      description: '容易脚滑',
      full: 'images/gallery-default-4.jpg'
    },
    {
      id: 5,
      title: '静谧四季',
      description: '可是雪~飘散了近双眼',
      full: 'images/gallery-default-5.jpg'
    },
    {
      id: 6,
      title: '小花小草',
      description: '养花的秘诀就是勤换花',
      full: 'images/gallery-default-6.jpg'
    }
  ];
}
