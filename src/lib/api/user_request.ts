import axios from 'axios';
import { API_BASE_URL, type BaseResponse } from './config';

export interface UserInfo {
    user_avatar: string;
    user_bacground: string;
    user_email: string;
    user_name: string;
    user_signature: string;
}

export const getUserInfo = async () => {
    const result: BaseResponse<UserInfo> = await axios.get(API_BASE_URL + '/user')
    .then(function(response){
        return response.data;
    })
    .catch(function(error){
        console.error("getUserInfo error: ", error);
        const back: BaseResponse<UserInfo> = {
            code: -1,
            message: "getUserInfo error ",
            data: null
        }
        return back;
    })
    return result;
}; 