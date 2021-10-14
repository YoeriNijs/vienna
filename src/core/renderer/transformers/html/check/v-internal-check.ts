import {VComponentType} from "../../../../component/v-component-type";

export interface VInternalCheck {
    accept: (element: Element) => boolean;
    transform: (document: Document, element: Element, callInternalMethod: Function, component?: VComponentType, attributes?: NamedNodeMap) => Document;
}