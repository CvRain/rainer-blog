import axios from 'axios';

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
    const response = await axios.post('http://localhost:4000/api/user/login', {
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

export async function getUserInfo(): Promise<{code: number; message: string; data: UserInfo}> {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/api/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
} 