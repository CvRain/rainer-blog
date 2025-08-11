import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseResponse, UserInfo } from './types';

@Injectable({
  providedIn: 'root'
})

export class User {
  constructor(private httpClient: HttpClient) {

  }

  getUserInfo(): Observable<BaseResponse<UserInfo>> {
    return this.httpClient.get<BaseResponse<UserInfo>>(
      environment.apiUrl + '/user'
    ).pipe(
      map(response => response)
    );
  }
}
