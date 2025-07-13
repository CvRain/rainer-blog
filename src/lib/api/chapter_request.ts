import { API_BASE_URL, type BaseResponse } from "./config"
import { type ApiChapter, type ResponseErrors } from "./response_schema"
import axios from "axios"
import { handleError } from "./config"

export async function createChapter(name: string, themeId: string): Promise<BaseResponse<ApiChapter | ResponseErrors>> {
    const request = {
        name: name,
        theme_id: themeId
    }

    const header = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    const config = {
        method: 'post',
        url: `${API_BASE_URL}/chapter/one`,
        headers: header,
        data: request
    }

    const response = await axios(config)
        .then(function (response) {
            return response.data;
        }).catch(handleError);

    return response;
}

/**
 * 
 * @param id 章节id
 * @returns 204 删除成功, 404 删除失败
 */
export async function removeChapter(id: string): Promise<BaseResponse<null>> {
    const config = {
        method: 'delete',
        url: `${API_BASE_URL}/chapter/${id}`,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    const response = await axios(config)
        .then(function (response) {
            return response.data;
        }).catch(handleError);
    return response;
}

// export async function updateChapter(request: UpdateChapterSchema): Promise<BaseResponse<ApiChapter>> { 

// }