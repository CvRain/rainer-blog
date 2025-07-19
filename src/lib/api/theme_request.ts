import axios from "axios";
import { API_BASE_URL, type BaseResponse, handleError } from "./config";
import { type ApiTheme, type ThemeCountData, type ThemeWithSchema, type ThemeWithStatSchema } from "./response_schema";
import type { UpdateThemeSchema } from "./request_schema";


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
    const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    const config = {
        headers: headers,
        method: 'get',
        url: API_BASE_URL + "/theme/all/with_stats"
    }

    const response = await axios(config)
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


export async function updateThemeInfo(schema: UpdateThemeSchema) {
    const config = {
        method: 'patch',
        url: API_BASE_URL + '/theme/one',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        data: schema
    }

    const response = await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(handleError);
    return response;
}

export async function getThemeWithDetails(): Promise<BaseResponse<ApiTheme[]>> {
    const header = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const config = {
        headers: header,
        method: 'get',
        url: API_BASE_URL + "/theme/all/with_details"
    }
    return await axios(config)
    .then(function (response) {
        return response.data;
    })
    .catch(handleError);
}

export async function getOneThemeWithDetails(themeId: string): Promise<BaseResponse<ApiTheme>> {
    const header = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    const config = {
        headers: header,
        method: 'get',
        url: API_BASE_URL + `/theme/one/${themeId}/with_details`
    }
    return await axios(config)
    .then(function (response) {
        console.debug(response.data);
        return response.data;
    })
    .catch(handleError);
}

export async function getActiveThemeInfo(): Promise<BaseResponse<ThemeWithSchema>> {
    const config = {
        method: 'get',
        url: API_BASE_URL + '/theme/active',
    }
    return await axios(config)
    .then(function (response) {
        return response.data;
    })
    .catch(handleError);
}

export async function getActiveThemeDetails(themeId: string) {
    const config = {
        method: 'get',
        url: `${API_BASE_URL}/theme/active_details/${themeId}`
    };
    return await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(handleError);
}