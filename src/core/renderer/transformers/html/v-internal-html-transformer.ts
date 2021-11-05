import {VComponentType} from "../../../component/v-component-type";

export interface VInternalHtmlTransformer {
    transform: (html: string, component?: VComponentType, attributes?: NamedNodeMap) => string;
}
