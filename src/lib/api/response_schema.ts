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