import {VComponentType, VGlobalStyles} from "../../../core";
import {Type} from "../../../core/injector/v-injector";

export interface VComponentFactoryOptions {
    component: Type<VComponentType>;
    declarations?: Type<VComponentType>[];
    globalStyles?: VGlobalStyles
}
