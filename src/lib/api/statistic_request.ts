import axios from "axios";
import type { BaseResponse } from "./config";

export interface AssetOverview {
    article_count: number,
    article_append_weekly: number,
    theme_count: number,
    theme_append_weekly: number,
    collection_count: number,
    collection_append_weekly: number,
    resource_count: number,
    resource_append_weekly: number
}

export async function getAssetOverview(): Promise<BaseResponse<AssetOverview>> {
    const response = await axios.get('http://localhost:4000/api/total/overview')
        .then(function (response) {
            console.log(response);
            return response.data;
        }).catch(function (error) {
            console.log(error);
        });
    return response;
}