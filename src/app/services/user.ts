import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BaseResponse,
  UserInfo,
  UserLoginResponse,
  TokenVerifyResponse,
  TotalOverview,
} from './types';

@Injectable({
  providedIn: 'root',
})
export class User {
  constructor(private httpClient: HttpClient) {}

  getUserInfo(): Observable<BaseResponse<UserInfo>> {
    return this.httpClient
      .get<BaseResponse<UserInfo>>(environment.apiUrl + '/user')
      .pipe(map((response) => response));
  }

  userLogin(
    name: string,
    password: string
  ): Observable<BaseResponse<UserLoginResponse>> {
    return this.httpClient
      .post<BaseResponse<UserLoginResponse>>(
        environment.apiUrl + '/user/login',
        {
          user_name: name,
          user_password: password,
        }
      )
      .pipe(map((response) => response));
  }

  updateUserInfo(
    userInfo: Partial<UserInfo> & { user_password?: string }
  ): Observable<BaseResponse<UserInfo>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient
      .patch<BaseResponse<UserInfo>>(environment.apiUrl + '/user', userInfo, {
        headers,
      })
      .pipe(
        map((response) => response) // API returns the updated user object wrapped in BaseResponse
      );
  }

  verifyToken(token: string): Observable<BaseResponse<TokenVerifyResponse>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.httpClient
      .get<BaseResponse<TokenVerifyResponse>>(
        environment.apiUrl + '/user/verify',
        { headers }
      )
      .pipe(map((response) => response));
  }

  totalOverview(): Observable<BaseResponse<TotalOverview>> {
    return this.httpClient
      .get<BaseResponse<TotalOverview>>(environment.apiUrl + '/total/overview')
      .pipe(map((response) => response));
  }
}
