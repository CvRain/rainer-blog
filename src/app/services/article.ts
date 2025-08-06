import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiArticle, BaseResponse } from './types';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Article {
  constructor(private http: HttpClient) {}

  getPublicArticleList(page: number = 1, size: number = 10): Observable<BaseResponse<ApiArticle[]>> {
    const url = `${environment.apiUrl}/article/public_list`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', size.toString());

    return this.http.get<BaseResponse<ApiArticle[]>>(url, { params });
  }

  getPublicArticleById(id: string): Observable<BaseResponse<ApiArticle>> {
    const url = `${environment.apiUrl}/article/public/${id}`;
    return this.http.get<BaseResponse<ApiArticle>>(url);
  }
}