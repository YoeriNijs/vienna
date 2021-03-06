import {VInternalTemplate} from "./v-internal-template";
import {getDefinedOrElseDefault, getNestedPropertyByStringPath} from "../util/v-internal-object-util";
import {escapeBracketsInRegex} from "../util/v-internal-regex-util";
import {filterXSS} from "xss";

export class VInternalTemplateEngine {

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
            return filterXSS(`${value}`);
        });
    }
}
