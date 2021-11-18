import {VInternalEventbus} from "../eventbus/v-internal-eventbus";

export interface VInternalRendererOptions {
    selector: string;
    eventBus: VInternalEventbus;
    rootElementSelector?: string;
}
