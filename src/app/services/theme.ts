import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiTheme, BaseResponse, BaseThemeSchema } from './types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Theme {

  constructor(private httpClient: HttpClient) {

  }

  getActiveThemes(): Observable<BaseResponse<BaseThemeSchema[]>> {
    return this.httpClient.get<BaseResponse<BaseThemeSchema[]>>(
      environment.apiUrl + '/theme/active'
    ).pipe(
      map(response => response)
    )
  }

  getThemeWithDetail(themeId: string): Observable<BaseResponse<ApiTheme>> {
    return this.httpClient.get<BaseResponse<ApiTheme>>(
      `${environment.apiUrl}/theme/one/${themeId}/with_details`
    ).pipe(
      map(response => response)
    )
  }

  getAll(): Observable<BaseResponse<BaseThemeSchema[]>> {
    const token = localStorage.getItem('token');
    return this.httpClient.get<BaseResponse<BaseThemeSchema[]>>(
      environment.apiUrl + '/theme/all',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

  createOne(name: string, description: string): Observable<BaseResponse<BaseThemeSchema>> {
    const token = localStorage.getItem('token');
    return this.httpClient.post<BaseResponse<BaseThemeSchema>>(
      environment.apiUrl + '/theme/one',
      { name, description },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

  removeOne(themeId: string): Observable<BaseResponse<BaseThemeSchema>> {
    const token = localStorage.getItem('token');
    return this.httpClient.delete<BaseResponse<BaseThemeSchema>>(
      environment.apiUrl + '/theme/one',
      {
        body: {
          id: themeId
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    ).pipe(
      map(response => response)
    )
  }

  updateOne(theme: BaseThemeSchema): Observable<BaseResponse<BaseThemeSchema>> {
    const token = localStorage.getItem('token');
    return this.httpClient.put<BaseResponse<BaseThemeSchema>>(
      environment.apiUrl + '/theme/one',
      theme,
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).pipe(
      map(response => response)
    )
  }
}
