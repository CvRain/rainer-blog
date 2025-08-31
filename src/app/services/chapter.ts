import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse, BaseThemeSchema, ApiChapter } from './types';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class Chapter {

  constructor(private httpClient: HttpClient) {

  }

  getChapter(page: number, pageSize: number): Observable<BaseResponse<ApiChapter[]>> {
    return this.httpClient.get<BaseResponse<ApiChapter[]>>(
      `${environment.apiUrl}/chapter/?page=${page}&page_size=${pageSize}`
    ).pipe(
      map(response => response)
    )
  }

  //获取指定theme下的所有Chapter
  getChapterByTheme(themeId: string): Observable<BaseResponse<ApiChapter[]>> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<BaseResponse<ApiChapter[]>>(
      `${environment.apiUrl}/chapter/theme/${themeId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

  //获取指定主题下激活章节 
  getActiveChapterByTheme(themeId: string): Observable<BaseResponse<ApiChapter[]>> {
    return this.httpClient.get<BaseResponse<ApiChapter[]>>(
      `${environment.apiUrl}/chapter/theme/${themeId}/active`
    ).pipe(
      map(response => response)
    )
  }

  createOne(name: string, themeId: string): Observable<BaseResponse<ApiChapter>> {
    const token = localStorage.getItem('token');
    return this.httpClient.post<BaseResponse<ApiChapter>>(
      `${environment.apiUrl}/chapter/one`,
      {
        name,
        theme_id: themeId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

  updateOne(chapter: ApiChapter): Observable<BaseResponse<ApiChapter>> {
    const token = localStorage.getItem('token');
    return this.httpClient.patch<BaseResponse<ApiChapter>>(
      `${environment.apiUrl}/chapter/one`,
      chapter,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

  removeOne(chapterId: string): Observable<BaseResponse<ApiChapter>> {
    const token = localStorage.getItem('token');
    return this.httpClient.delete<BaseResponse<ApiChapter>>(
      `${environment.apiUrl}/chapter/${chapterId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

}
