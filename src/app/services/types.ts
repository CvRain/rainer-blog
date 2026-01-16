export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T | undefined;
}

export interface UserLink {
  title: string;
  url: string;
}

export interface UserInfo {
  id: string;
  user_name: string;
  user_email: string;
  user_nickname: string;
  user_signature: string;
  user_bio: string;
  user_avatar: string;
  user_background: string;
  links: UserLink[];
  user_location: string;
  is_active: boolean;
  inserted_at: string;
  updated_at: string;
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

export interface UserLoginResponse {
  user: UserInfo;
  token: string;
}

export interface TokenVerifyResponse {
  user_email: string;
  user_name: string;
}

export interface TotalOverview {
  article_append_weekly: number;
  article_count: number;
  collection_append_weekly: number;
  collection_count: number;
  resource_append_weekly: number;
  resource_count: number;
  theme_append_weekly: number;
  theme_count: number;
  [property: string]: any;
}

export interface ArticleCountData {
  count: number;
  [property: string]: any;
}

export interface UpdateArticleSchema {
  id: string;
  title: string;
  content: string;
  s3_content: string;
  chapter_id: string;
  order: number;
  is_active: boolean;
}

export interface ApiCollection {
  id: string;
  name: string;
  description: string;
  order: number;
  is_active: boolean;
  inserted_at: string;
  updated_at: string;
}
