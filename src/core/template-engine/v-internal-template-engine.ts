import {VInternalTemplate} from "./v-internal-template";
import {VTemplateRenderException} from "./v-template-render-exception";
import {getDefinedOrElse, getNestedPropertyByStringPath} from "../util/v-internal-object-util";
import {escapeBracketsInRegex} from "../util/v-internal-regex-util";

const REGEX_TAG_BODY = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
const REGEX_TAG_OR_COMMENT = new RegExp(
    `${'<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b'}${REGEX_TAG_BODY}>[\\s\\S]*?</script\\s*`
    + `|style\\b${REGEX_TAG_BODY}>[\\s\\S]*?</style\\s*`
    // Regular name
    + `|/?[a-z]${
        REGEX_TAG_BODY
    })>`,
    'gi',
);

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
                throw new VTemplateRenderException(`Cannot find value for template reference '${match}'. Raw value: ${rawValue}`)
            });
            return VInternalTemplateEngine.sanitize(`${value}`);
        });
    }

    private static sanitize(value: string): string {
        // Reference: https://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side
        let prev;
        do {
            prev = value;
            value = value.replace(REGEX_TAG_OR_COMMENT, '');
        } while (value !== prev);
        return value.replace(/</g, '&lt;');
    }
}
