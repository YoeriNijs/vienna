import {VComponentType} from "../../../core";
import {Type} from "../../../core/injector/v-injector";

export interface VHostFactoryOptions {
    component: Type<VComponentType>;
    hostHtml: string;
}
