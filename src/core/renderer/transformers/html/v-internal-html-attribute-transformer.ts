import {VInternalHtmlTransformer} from "./v-internal-html-transformer";
import {VInternalHtmlAttributeMap} from "../../v-internal-html-attribute-map";
import {replaceAll} from "../../../util/v-internal-regex-util";

export class VInternalHtmlAttributeTransformer implements VInternalHtmlTransformer {
    transform(html: string): string {
        return VInternalHtmlAttributeMap.reduce((transformedHtml, attr) => {
            const from = attr.clientAttrName.toLowerCase();
            const to = attr.internalClientAttrName;
            return replaceAll(transformedHtml, from, to);
        }, html);
    }
}