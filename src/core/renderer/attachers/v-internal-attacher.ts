import {VComponentType} from "../../component/v-component-type";
import {VInternalAttacherMethods} from "./v-internal-attacher-methods";

export interface VInternalAttacher {
    accept(component: VComponentType, shadowRoot: ShadowRoot): boolean;

    attach(component: VComponentType, shadowRoot: ShadowRoot, internalMethods?: VInternalAttacherMethods): void;
}