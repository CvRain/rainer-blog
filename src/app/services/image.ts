import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface BingImageResponse {
  images: BingImage[];
}

export interface BingImage {
  url: string;
  title: string;
  copyright: string;
  copyrightlink: string;
  quiz: string;
  wp: boolean;
  hsh: string;
  drk: number;
  top: number;
  bot: number;
  hs: any[];
}

@Injectable({
  providedIn: 'root'
})
export class BingImageService {
  private bingApiUrl = 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1';

  constructor(private http: HttpClient) { }

  /**
   * 获取必应每日一图
   */
  getBingDailyImage(): Observable<BingImage> {
    return this.http.get<BingImageResponse>(this.bingApiUrl).pipe(
      map(response => response.images[0])
    );
  }

  /**
   * 获取必应每日一图的完整 URL
   */
  getBingDailyImageUrl(): Observable<string> {
    return this.getBingDailyImage().pipe(
      map(image => `https://cn.bing.com${image.url}`)
    );
  }
}