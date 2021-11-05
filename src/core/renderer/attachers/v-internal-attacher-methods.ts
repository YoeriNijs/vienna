import {VComponentType} from "../../component/v-component-type";

export interface VInternalAttacherMethods {
    callInternalMethod: (component: VComponentType, methodName: string, htmlElement?: HTMLElement) => void;
    forceRebuild: () => void;
}