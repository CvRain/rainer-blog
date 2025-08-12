import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseResponse, BaseThemeSchema} from './types';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

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
}
