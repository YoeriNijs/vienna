import {VInternalTemplate} from "./v-internal-template";
import {VTemplateRenderException} from "./v-template-render-exception";
import {getDefinedOrElse, getNestedPropertyByStringPath} from "../util/v-internal-object-util";
import {escapeBracketsInRegex} from "../util/v-internal-regex-util";
import { filterXSS } from "xss";

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
            const value = getDefinedOrElse<any>(rawValue, () => {
                throw new VTemplateRenderException(`Cannot find value for template reference '${match}'.`)
            });
            return filterXSS(`${value}`);
        });
    }
}
