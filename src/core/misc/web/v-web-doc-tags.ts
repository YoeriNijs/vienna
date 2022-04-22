export interface VWebDocMetaTag {
    name: string;
    content: string;
}

export interface VWebDocTags {
    title?: string;
    meta?: VWebDocMetaTag[];
}