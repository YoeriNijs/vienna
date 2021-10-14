import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VComponentType} from "../../../component/v-component-type";
import {VInternalTemplate} from "../../../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../../../template-engine/v-internal-template-engine";

export class VInternalTemplateTransformer implements VInternalHtmlTransformer {
    transform(html: string, component: VComponentType): string {
        const template = new VInternalTemplate(html);
        return VInternalTemplateEngine.render(template, component);
    }
}
