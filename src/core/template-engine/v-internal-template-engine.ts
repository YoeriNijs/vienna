import {VInternalTemplate} from "./v-internal-template";
import {VTemplateRenderException} from "./v-template-render-exception";
import {getDefinedOrElse, getNestedPropertyByStringPath} from "../util/v-internal-object-util";

const REGEX_REFERENCE_WITH_BRACKETS = /{{(.*?)}}/g;
const REGEX_REFERENCE_WITHOUT_BRACKETS = /{{|}}/;
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

    public static render(template: VInternalTemplate, data: any): string {
        return template.get().replace(REGEX_REFERENCE_WITH_BRACKETS, (match: string) => {
            const templateReference = match.split(REGEX_REFERENCE_WITHOUT_BRACKETS)
                .filter(v => v)[0]
                .trim();
            const rawValue = getNestedPropertyByStringPath(data, templateReference);
            const value = getDefinedOrElse<any>(rawValue, () => {
                throw new VTemplateRenderException(`Cannot find value for template reference '${match}'`)
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

    private constructor() {
        // Util class
    }
}
