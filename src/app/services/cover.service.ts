import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseResponse } from './types';

export interface CoverInfo {
  owner_type: 'theme' | 'chapter' | 'article';
  owner_id: string;
  url: string;
  resource?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CoverService {
  constructor(private http: HttpClient) {}

  uploadAndSetCover(
    file: File,
    ownerType: 'theme' | 'chapter' | 'article',
    ownerId: string,
  ): Observable<BaseResponse<CoverInfo>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('owner_type', ownerType);
    formData.append('owner_id', ownerId);

    // Optional: add name/description if needed
    formData.append('name', file.name);

    const token = localStorage.getItem('token');

    // Angular HttpClient handles Content-Type for FormData automatically
    return this.http.post<BaseResponse<CoverInfo>>(
      `${environment.apiUrl}/cover/upload_set`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  getCoverUrl(
    ownerType: 'theme' | 'chapter' | 'article',
    ownerId: string,
  ): Observable<string | null> {
    return this.http
      .get<BaseResponse<{ url: string }>>(`${environment.apiUrl}/cover/url`, {
        params: {
          owner_type: ownerType,
          owner_id: ownerId,
        },
      })
      .pipe(
        map((response) => {
          if (response.code === 200 && response.data) {
            return response.data.url;
          }
          return null;
        }),
      );
  }

  deleteCover(
    ownerType: 'theme' | 'chapter' | 'article',
    ownerId: string,
  ): Observable<boolean> {
    const token = localStorage.getItem('token');
    return this.http
      .delete<BaseResponse<any>>(`${environment.apiUrl}/cover/`, {
        params: {
          owner_type: ownerType,
          owner_id: ownerId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(map((response) => response.code === 200));
  }
}
