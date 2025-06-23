import axios from "axios";
import { API_BASE_URL, type BaseResponse, handleError } from "./config";

export interface ThemeCountData  {
    count: number;
}

export interface ThemeWithStatSchema{
    article_count: number;
    chapter_count: number;
    description: string;
    id: string;
    inserted_at: string;
    is_active: boolean;
    name: string;
    order: number;
    updated_at: string;
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

export async function getAllThemeWithStats (): Promise<BaseResponse<ThemeSchema[]>> { 
    const response = await axios.get(API_BASE_URL + "/theme/all/with_stats")
    .then(function (response) {
        return response.data;
    })
    .catch(handleError);
    return response;
}