import {VWebDocMetaTag, VWebDocTags} from "../misc/web";

export const getCurrentDocMetaTags = (): VWebDocMetaTag[] => {
    return Array.from(document.head.children)
        .filter(c => c.tagName.toLowerCase() === 'meta')
        .map((c: HTMLMetaElement) => {
            return {name: c.name, content: c.content};
        }) || [];
}

export const getCurrentDocTitle = (): string => document.title;

export const getCurrentDocTags = (): VWebDocTags => {
    return {
        title: getCurrentDocTitle(),
        meta: getCurrentDocMetaTags()
    }
}