import {VInjectable} from "../../injector/v-injectable-decorator";

export interface VWebOptions {
    trim?: boolean;
    toLowerCase?: boolean;
}

@VInjectable({ singleton: false })
export class VWeb {

    /**
     * Creates a slug for a given string. E.g. 'my string' will become 'my-string'.
     * @param value
     * @param options
     */
    slugify(value: string, options: VWebOptions = { trim: true, toLowerCase: true }): string {
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
}