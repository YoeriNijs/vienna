import {VComponentType} from "../../component/v-component-type";

export interface VInternalRendererTransformer {
    transform: (html: string, component: VComponentType, attributes?: NamedNodeMap) => string;
}
