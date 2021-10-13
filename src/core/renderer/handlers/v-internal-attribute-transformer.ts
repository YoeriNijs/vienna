import {VInternalRendererTransformer} from "./v-internal-renderer-transformer";
import {VComponentType} from "../../component/v-component-type";
import {VInternalTemplate} from "../../template-engine/v-internal-template";
import {VInternalTemplateEngine} from "../../template-engine/v-internal-template-engine";

export class VInternalAttributeTransformer implements VInternalRendererTransformer {
    transform(html: string, component: VComponentType, attributes: NamedNodeMap | undefined): string {
        const attributeBindings = Array.from(attributes)
            .filter(attr => Object.getPrototypeOf(component)[`vProp:${attr.name}`] === 'binded')
            .reduce((prevValue, attr) => {
                const key = attr.name.replace('vProp:', '');
                const value = attr.value;

                let obj: any = {};
                obj[key] = value;

                return {...prevValue, ...obj};
            }, {});
        if (Object.keys(attributeBindings).length === 0) {
            return html;
        }
        const template = new VInternalTemplate(html);
        return VInternalTemplateEngine.render(template, attributeBindings);
    }
}
