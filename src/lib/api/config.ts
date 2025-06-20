import { AxiosError } from "axios";

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
