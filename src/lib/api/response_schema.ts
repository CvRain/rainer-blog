export interface ResponseErrors{
    name: string[];
}

export interface ThemeCountData {
    count: number;
}

export interface ThemeWithSchema {
    description: string;
    id: string;
    inserted_at: string;
    is_active: boolean;
    name: string;
    order: number;
    updated_at: string;
}


export interface ThemeWithStatSchema {
    article_count: number;
    chapter_count: number;
    description: string;
    id: string;
    inserted_at: string;
    is_active: boolean;
    name: string;
    order: number;
    updated_at: string;
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
}

export interface ApiArticleDetail {
    id: string;
    title: string;
    content: string;
    aws_key: string;
    chapter_id: string;
    inserted_at: string;
    updated_at: string;
    s3_content: string;
}