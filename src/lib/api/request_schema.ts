export interface UpdateThemeSchema {
    id: string;
    name: string;
    description?: string;
    order?: number;
    is_active?: boolean
}

export interface UpdateChapterSchema {
    id: string;
    name: string |null ;
}