import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VComponentEncapsulationMode} from "../component/v-component-encapsulation";
import {VGlobalStyles} from "../application/v-global-styles";

export interface VInternalRendererOptions {
    selector: string;
    eventBus: VInternalEventbus;
    rootElementSelector?: string;
    encapsulationModeOverride?: VComponentEncapsulationMode;
    globalStyles?: VGlobalStyles;
}
