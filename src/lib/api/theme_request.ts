import axios from "axios";
import { API_BASE_URL, type BaseResponse, handleError } from "./config";

export interface ThemeCountData {
    count: number;
}

export interface ThemeWithSchema {
    description: string;
    id: string;
    inserted_at: string;
    is_active: boolean;
    name: string;
    order: number;
    updated_at: string;
}


export interface ThemeWithStatSchema {
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

export async function getAllThemeWithStats(): Promise<BaseResponse<ThemeWithStatSchema[]>> {
    const response = await axios.get(API_BASE_URL + "/theme/all/with_stats")
        .then(function (response) {
            return response.data;
        })
        .catch(handleError);
    return response;
}

export async function removeTheme(themeId: string): Promise<BaseResponse<null>> {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    const requestBody = {
        id: themeId
    }

    const config = {
        headers: headers,
        method: 'DELETE',
        url: API_BASE_URL + `/theme/remove`,
        data: requestBody
    }

    const response = await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(handleError);
    return response;
}

export async function createTheme(name: string, description: string): Promise<BaseResponse<ThemeWithSchema>> {
    const data = {
        name: name,
        description: description,
    }

    const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    const config = {
        method: 'post',
        url: API_BASE_URL + '/theme/one',
        headers: headers,
        data: data
    }

    const response = await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(handleError);
    return response;
}