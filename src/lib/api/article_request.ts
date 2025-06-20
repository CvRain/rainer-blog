import { API_BASE_URL, type BaseResponse } from "./config";

import axios from "axios";
import { handleError } from "./config";

export interface ArticleCountData {
    count: number
}
export async function getArticleCount(): Promise<BaseResponse<ArticleCountData>> {
    const response = await axios.get(`${API_BASE_URL}/article/count`)
        .then(function (response) {
            return response.data;
        }).catch(handleError);
    return response;
}

export async function getArticleCountThisWeek(): Promise<BaseResponse<ArticleCountData>> {
    const response = await axios.get(`${API_BASE_URL}/article/count/this_week`)
        .then(function (response) {
            return response.data;
        }).catch(handleError);
    return response;
}