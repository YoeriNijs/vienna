import {VInjectable} from "../../injector/v-injectable-decorator";
import * as Cookies from "js-cookie";
import {CookieAttributes} from "js-cookie";
import {VWebDocMetaTag, VWebDocTags} from "./v-web-doc-tags";
import {getCurrentDocMetaTags} from "../../util/v-internal-document-util";

export interface VSlugifyOptions {
    trim?: boolean;
    toLowerCase?: boolean;
}

export type VCookieOptions = CookieAttributes;

@VInjectable({singleton: false})
export class VWeb {

    private static createHtmlMetaElement(tag: VWebDocMetaTag): HTMLMetaElement {
        const el: HTMLMetaElement = document.createElement('meta');
        el.name = tag.name;
        el.content = tag.content;
        return el
    }

    /**
     * Creates a slug for a given string. E.g. 'my string' will become 'my-string'.
     * @param value
     * @param options
     */
    slugify(value: string, options: VSlugifyOptions = {trim: true, toLowerCase: true}): string {
        if (!value) {
            return '';
        }
        if (options.trim) {
            value = value.trim();
        }
        if (options.toLowerCase) {
            value = value.toLowerCase();
        }

        return value.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-');
    }

    /**
     * Returns a cookie for a given name. Will return undefined when the cookie
     * does not exist.
     * @param name
     */
    getCookie(name: string): string | undefined {
        return Cookies.get(name);
    }

    /**
     * Store a cookie value for a given name. With options, you can specify some cookie
     * details, such as secure and http only flags.
     * @param name
     * @param value
     * @param options
     */
    setCookie(name: string, value: string, options: VCookieOptions = {}): void {
        Cookies.set(name, value, options);
    }

    /**
     * Remove a cookie value for a given name.
     * @param name
     */
    removeCookie(name: string): void {
        Cookies.remove(name);
    }

    /**
     * Override the document tags with custom tags
     * @param tags
     */
    overrideTags(tags: VWebDocTags): void {
        // Set document title
        if (tags && tags.title) {
            document.title = tags.title;
        } else {
            document.title = document.title || 'Vienna application';
        }

        // Retrieve new tags
        const newMetaTags: VWebDocMetaTag[] = tags && tags.meta
            ? tags.meta
            : getCurrentDocMetaTags();


        // Remove old elements
        // Only replace the elements that we have a new value for.
        const metaTagsNames = newMetaTags
            .map(t => t.name)
            .map(name => name.toLowerCase());
        Array.from(document.head.children)
            .filter(c => c.tagName.toLowerCase() === 'meta')
            .filter(c => {
                // @ts-ignore
                return metaTagsNames.includes(c['name']);
            })
            .forEach(c => document.head.removeChild(c));

        // Update with new elements
        newMetaTags.map(tag => VWeb.createHtmlMetaElement(tag))
            .forEach(el => document.head.appendChild(el));
    }
}
