import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ApiArticle,
  ApiArticleContent,
  ArticleCountData,
  BaseResponse,
  UpdateArticleSchema,
} from "./types";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class Article {
  constructor(private http: HttpClient) {}

  getPublicArticleList(
    page: number = 1,
    size: number = 10,
  ): Observable<BaseResponse<ApiArticle[]>> {
    const url = `${environment.apiUrl}/article/public_list`;
    let params = new HttpParams()
      .set("page", page.toString())
      .set("page_size", size.toString());

    return this.http.get<BaseResponse<ApiArticle[]>>(url, { params });
  }

  getArticleCount(): Observable<BaseResponse<ArticleCountData>> {
    const url = `${environment.apiUrl}/article/count`;
    return this.http.get<BaseResponse<ArticleCountData>>(url);
  }

  getArticleAppendCountWeekly(): Observable<BaseResponse<ArticleCountData>> {
    const url = `${environment.apiUrl}/article/count/this_week`;
    return this.http.get<BaseResponse<ArticleCountData>>(url);
  }

  createArticle(
    title: string,
    content: string | null,
    chapter_id: string,
  ): Observable<BaseResponse<ApiArticle>> {
    const url = `${environment.apiUrl}/article/one`;
    const token = localStorage.getItem("token");
    const data = {
      title: title,
      content: content || title,
      chapter_id: chapter_id,
    };
    return this.http.post<BaseResponse<ApiArticle>>(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  removeArticle(article_id: string): Observable<BaseResponse<undefined>> {
    const url = `${environment.apiUrl}/article/one`;
    const token = localStorage.getItem("token");
    const data = {
      id: article_id,
    };
    return this.http.delete<BaseResponse<undefined>>(url, {
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getArticleDetail(id: string): Observable<BaseResponse<ApiArticleContent>> {
    const url = `${environment.apiUrl}/article/one/${id}`;
    return this.http
      .get<BaseResponse<ApiArticleContent>>(url)
      .pipe((response) => response);
  }

  getArticleS3ContentById(id: string): Observable<BaseResponse<ApiArticleContent>> {
    const url = `${environment.apiUrl}/article/one/${id}`;
    return this.http.get<BaseResponse<ApiArticleContent>>(url);
  }

  updateArticleContent(
    updateArticleSchema: UpdateArticleSchema,
  ): Observable<BaseResponse<ApiArticleContent>> {
    const url = `${environment.apiUrl}/article/one`;
    const token = localStorage.getItem("token");
    return this.http.patch<BaseResponse<ApiArticleContent>>(
      url,
      updateArticleSchema,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
}
