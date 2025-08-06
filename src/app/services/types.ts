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

export interface ApiArticle {
  id: string;
  title: string;
  content: string;
  aws_key: string;
  order: number;
  is_active: boolean;
  chapter_id: string;
  inserted_at: string;
  updated_at: string;
}
