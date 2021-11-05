import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VInternalHtmlAttributeMap} from "../../v-internal-html-attribute-map";

export class VInternalHtmlAttributeTransformer implements VInternalHtmlTransformer {
    private static replaceAll(str: string, find: string, replace: string): string {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    transform(html: string): string {
        return VInternalHtmlAttributeMap.reduce((transformedHtml, attr) =>
            VInternalHtmlAttributeTransformer.replaceAll(transformedHtml, attr.clientAttrName, attr.internalClientAttrName), html);
    }
}