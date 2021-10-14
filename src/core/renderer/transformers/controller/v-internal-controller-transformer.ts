import {VComponentType} from "../../../component/v-component-type";

export interface VInternalControllerTransformer {
    transform: (component: VComponentType, attributes?: NamedNodeMap) => VComponentType;
}