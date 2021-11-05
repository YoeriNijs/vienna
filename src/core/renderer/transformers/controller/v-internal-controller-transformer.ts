import {VComponentType} from "../../../component/v-component-type";

export interface VInternalControllerTransformer {
    accept(component: VComponentType, attributes: NamedNodeMap | undefined): boolean;

    transform(component: VComponentType, attributes: NamedNodeMap | undefined): VComponentType;
}