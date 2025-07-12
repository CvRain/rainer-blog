import {API_BASE_URL, type BaseResponse } from "./config"
import  {type ApiChapter, type ResponseErrors } from "./response_schema"
import axios from "axios"
import { handleError } from "./config"

export async function createChapter(title: string, themeId: string): Promise<BaseResponse<ApiChapter | ResponseErrors>> {
    const request = {
        title: title,
        theme_id: themeId
    }
    
    const header = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    const config = {
        method: 'post',
        url:`${API_BASE_URL}/chapter`,
        headers: header,
        data: request
    }

    const response = await axios(config)
    .then(function (response) {
        return response.data;
    }).catch(handleError);

    return response;
}