import axios from 'axios';
import { API_BASE_URL, handleError, type BaseResponse } from './config';

export interface UserInfo {
    user_name: string;
    user_email: string;
    user_signature: string;
    user_avatar: string;
    user_background: string;
}

export interface LoginResponse {
    code: number;
    message: string;
    data: {
        user: UserInfo;
        token: string;
    }
}

export async function login(userName: string, userPassword: string): Promise<LoginResponse> {
    const response = await axios.post(`${API_BASE_URL}/user/login`, {
        user_name: userName,
        user_password: userPassword
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.data.code === 200) {
        // 保存token到localStorage
        localStorage.setItem('token', response.data.data.token);
    }

    return response.data;
}

export async function verifyToken(): Promise<BaseResponse<UserInfo>> {
    const tokenString = localStorage.getItem('token');
    if(!tokenString){
        return {
            code: 401,
            message: 'Unauthorized',
            data: null
        }
    }

    const config = {
        headers: {
            'Authorization': 'Bearer ' + tokenString,
            'Content-Type': 'application/json'
        },
        method: 'get',
        url: API_BASE_URL + "/user/verify"
    }

    const response = await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(handleError);
    return response;
}

export async function getUserInfo(): Promise<BaseResponse<UserInfo>> {
    return await axios.get(API_BASE_URL + "/user")
        .then((response) => {
            return response.data;
        }).catch(handleError)
}  