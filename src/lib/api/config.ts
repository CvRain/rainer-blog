import { AxiosError } from "axios";
import type { ApiArticle, ApiArticleDetail } from "./response_schema";

export const API_BASE_URL = 'http://localhost:4000/api';

export interface BaseResponse<T> {
    code: number;
    message: string;
    data: T | null;
}

interface ErrorMessage {
    message?: string;
}

export function handleError(error: AxiosError): BaseResponse<ErrorMessage> {
    console.error('API Error:', error);
    
    const errorMessage =
      (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? (error.response.data as { message?: string }).message
        : undefined) ||
      error.message ||
      '未知错误';
    const statusCode = error.response?.status || 500;
    
    return {
        code: statusCode,
        message: `请求失败: ${errorMessage}`,
        data: null
    };
}


export function ApiArticleToApiArticleDetail(article: ApiArticle): ApiArticleDetail {
    return {
        id: article.id,
        title: article.title,
        content: article.content,
        aws_key: article.aws_key,
        chapter_id: article.chapter_id,
        inserted_at: article.inserted_at,
        updated_at: article.updated_at,
        s3_content: "",
        order: article.order,
        is_active: article.is_active
    }
}