export interface UpdateThemeSchema {
    id: string;
    name: string;
    description?: string;
    order?: number;
    is_active?: boolean
}

export interface UpdateChapterSchema {
    id: string;
    name: string | null;
}

export interface UpdateArticleSchema {
    id: string;
    title: string;
    content: string;
    s3_content: string ;
    chapter_id: string;
    order: number ;
    is_active: boolean;
}