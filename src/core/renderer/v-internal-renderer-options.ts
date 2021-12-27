import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VComponentEncapsulationMode} from "../component/v-component-encapsulation";

export interface VInternalRendererOptions {
    selector: string;
    eventBus: VInternalEventbus;
    rootElementSelector?: string;
    encapsulationModeOverride?: VComponentEncapsulationMode;
}
