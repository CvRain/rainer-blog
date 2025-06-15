export const API_BASE_URL = 'http://localhost:4000/api';

export interface BaseResponse<T> {
    code: number;
    message: string;
    data: T | null;
}