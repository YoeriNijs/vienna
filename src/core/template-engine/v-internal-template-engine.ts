import {VInternalTemplate} from "./v-internal-template";
import {getDefinedOrElseDefault, getNestedPropertyByStringPath} from "../util/v-internal-object-util";
import {escapeBracketsInRegex} from "../util/v-internal-regex-util";
import {filterXSS} from "xss";

export class VInternalTemplateEngine {

    private static replaceAll(str: string, find: string, replace: string): string {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    private constructor() {
        // Util class
    }

    public static render(template: VInternalTemplate, data: any, prefix = '{{', suffix = '}}'): string {
        const regexRefWithBrackets = new RegExp(escapeBracketsInRegex(`${prefix}(.*?)${suffix}`), 'g');
        const regexRefWithoutBrackets = new RegExp(escapeBracketsInRegex(`${prefix}|${suffix}`));
        return template.get().replace(regexRefWithBrackets, (match: string) => {
            const templateReference = match.split(regexRefWithoutBrackets)
                .filter(v => v)[0]
                .trim();
            const rawValue = typeof data === 'object'
                ? getNestedPropertyByStringPath(data, templateReference)
                : data;


            // Originally, this condition was throwing an exception. However, with conditional segments, template
            // refs may change over time. This means that the ref will be set later in time. This is totally valid.
            // So, if the value does not exist yet, we just return an empty string (YN).
            const value = getDefinedOrElseDefault<any>(rawValue, '');
            const convertedValue = VInternalTemplateEngine.valueToString(value);
            return filterXSS(convertedValue);
        });
    }

    /**
     * Convert this value to a string value.
     * - If it is an array, stringify it and base64 encode it
     * - If it is an object, just stringify if
     * - Otherwise, just return the value as string.
     */
    private static valueToString(value: any): string {
        if (Array.isArray(value)) {
            const valueAsString = JSON.stringify(value);
            return window.btoa(valueAsString);
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return `${value}`;
    }
}
