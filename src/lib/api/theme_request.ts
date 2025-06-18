import axios, { AxiosError } from "axios";
import { API_BASE_URL, type BaseResponse } from "./config";

export interface ThemeCountData  {
    count: number;
}

interface ErrorResponse {
    message?: string;
}

function handleError(error: AxiosError) {
    console.error('API Error:', error);
    
    const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message || '未知错误';
    const statusCode = error.response?.status || 500;
    
    return {
        code: statusCode,
        message: `请求失败: ${errorMessage}`,
        data: null
    };
}

export async function getThemeCount(): Promise<BaseResponse<ThemeCountData>> {     
    const response = await axios.get(API_BASE_URL + '/theme/count')
    .then(function (response) {
        return response.data;
    })
    .catch(handleError);
    return response;
}

export async function getCountThisWeek(): Promise<BaseResponse<ThemeCountData>> {
    const response = await axios.get(API_BASE_URL + "/theme/count/this_week") 
    .then(function (response) {
        return response.data;
    })
    .catch(handleError);
    return response;
}