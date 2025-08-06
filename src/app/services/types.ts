export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T | undefined;
}

export interface UserInfo {
  user_avatar: string;
  user_background: string;
  user_email: string;
  user_name: string;
  user_signature: string;
}