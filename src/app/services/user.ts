import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseResponse, UserInfo, UserLoginResponse} from './types';

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


  userLogin(name: string, password: string): Observable<BaseResponse<UserLoginResponse>> {
    return this.httpClient.post<BaseResponse<UserLoginResponse>>(environment.apiUrl + '/user/login', {
      user_name: name,
      user_password: password
    }).pipe(
      map(response => response)
    )
  }
}
