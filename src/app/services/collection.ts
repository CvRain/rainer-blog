import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiCollection, BaseResponse } from "./types";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class Collection {
  constructor(private http: HttpClient) {}

  getCount(): Observable<BaseResponse<{ count: number }>> {
    const url = `${environment.apiUrl}/collection/count`;
    return this.http.get<BaseResponse<{ count: number }>>(url);
  }

  getCountThisWeek(): Observable<BaseResponse<{ count: number }>> {
    const url = `${environment.apiUrl}/collection/count/this_week`;
    return this.http.get<BaseResponse<{ count: number }>>(url);
  }

  getAllActiveCollections(): Observable<BaseResponse<ApiCollection[]>> {
    const url = `${environment.apiUrl}/collection/all/active`;
    return this.http.get<BaseResponse<ApiCollection[]>>(url);
  }

  getOneCollection(id: string): Observable<BaseResponse<ApiCollection>> {
    const url = `${environment.apiUrl}/collection/${id}`;
    return this.http.get<BaseResponse<ApiCollection>>(url);
  }

  deleteOneCollection(id: string): Observable<BaseResponse<undefined>> {
    const token = localStorage.getItem("token");
    const url = `${environment.apiUrl}/collection/one`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      id: id,
    };
    return this.http
      .delete<BaseResponse<undefined>>(url, {
        headers,
        body,
      })
      .pipe(map((response) => response));
  }

  updateOneCollection(
    id: string,
    data: Partial<ApiCollection>,
  ): Observable<BaseResponse<ApiCollection>> {
    const token = localStorage.getItem("token");
    const url = `${environment.apiUrl}/collection/one`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      id: id,
      ...data,
    };
    return this.http
      .patch<BaseResponse<ApiCollection>>(url, {
        headers: headers,
        body: body,
      })
      .pipe(map((response) => response));
  }

  createOneCollection(
    data: Partial<ApiCollection>,
  ): Observable<BaseResponse<ApiCollection>> {
    const token = localStorage.getItem("token");
    const url = `${environment.apiUrl}/collection/one`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = {
      ...data,
    };
    return this.http
      .post<BaseResponse<ApiCollection>>(url, {
        headers,
        body,
      })
      .pipe(map((response) => response));
  }

  getAllCollections(): Observable<BaseResponse<ApiCollection[]>> {
    const token = localStorage.getItem("token");
    const url = `${environment.apiUrl}/collection/all`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http
      .get<BaseResponse<ApiCollection[]>>(url, {
        headers,
      })
      .pipe(map((response) => response));
  }
}
