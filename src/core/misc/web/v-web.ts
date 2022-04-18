import {VInjectable} from "../../injector/v-injectable-decorator";
import {CookieAttributes, get as getCookieValue, remove as removeCookieValue, set as setCookieValue} from "js-cookie";

export interface VWebOptions {
    trim?: boolean;
    toLowerCase?: boolean;
}

export type VCookieOptions = CookieAttributes;

@VInjectable({ singleton: false })
export class VWeb {

    /**
     * Creates a slug for a given string. E.g. 'my string' will become 'my-string'.
     * @param value
     * @param options
     */
    slugify(value: string, options: VWebOptions = { trim: true, toLowerCase: true }): string {
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
        return getCookieValue(name);
    }

    /**
     * Store a cookie value for a given name. With options, you can specify some cookie
     * details, such as secure and http only flags.
     * @param name
     * @param value
     * @param options
     */
    setCookie(name: string, value: string, options: VCookieOptions = {}): void {
        setCookieValue(name, value, options);
    }

    /**
     * Remove a cookie value for a given name.
     * @param name
     */
    removeCookie(name: string): void {
        removeCookieValue(name);
    }
}
