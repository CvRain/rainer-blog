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
  subtitle: string;
  aws_key: string;
  order: number;
  is_active: boolean;
  chapter_id: string;
  inserted_at: string;
  updated_at: string;

  [property: string]: any;
}

export interface ApiChapter {
  id: string;
  name: string;
  description: string | null;
  order: number;
  is_active: boolean;
  inserted_at: string;
  updated_at: string;
  theme_id: string;
  articles: ApiArticle[];

  [property: string]: any;
}

export interface ApiTheme {
  id: string;
  name: string;
  description: string | null;
  order: number;
  is_active: boolean;
  inserted_at: string;
  updated_at: string;
  chapters: ApiChapter[];

  [property: string]: any;
}

export interface ApiArticleContent {
  id: string;
  title: string;
  order: number;
  subtitle: string;
  aws_key: string;
  chapter_id: string;
  is_active: boolean;
  s3_content: string;
  inserted_at: string;
  updated_at: string;

  [property: string]: any;
}

export interface BaseThemeSchema {
  description: string;
  id: string;
  inserted_at: string;
  is_active: boolean;
  name: string;
  order: number;
  updated_at: string;

  [property: string]: any;
}

export interface UserLoginResponse{
  user: UserInfo,
  token: string;
}

export interface TokenVerifyResponse {
  user_email: string;
  user_name: string;
}