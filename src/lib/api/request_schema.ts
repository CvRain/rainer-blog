export interface UpdateThemeSchema {
    id: string;
    name: string;
    description?: string;
    order?: number;
    is_active?: boolean
}