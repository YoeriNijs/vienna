import {VInternalTemplate} from "./v-internal-template";
import {VTemplateRenderException} from "./v-template-render-exception";
import {getDefinedOrElse, getNestedPropertyByStringPath} from "../util/v-internal-object-util";

const REGEX_REFERENCE_WITH_BRACKETS = /{{(.*?)}}/g;
const REGEX_REFERENCE_WITHOUT_BRACKETS = /{{|}}/;

export class VInternalTemplateEngine {

    render(template: VInternalTemplate, data: any): string {
        return template.get().replace(REGEX_REFERENCE_WITH_BRACKETS, (match: string) => {
            const templateReference = match.split(REGEX_REFERENCE_WITHOUT_BRACKETS)
                .filter(v => v)[0]
                .trim();
            const rawValue = getNestedPropertyByStringPath(data, templateReference);
            const value = getDefinedOrElse(rawValue, () => {
                throw new VTemplateRenderException(`Cannot find value for template reference '${match}'`)
            });
            return `${value}`;
        })
    }
}
