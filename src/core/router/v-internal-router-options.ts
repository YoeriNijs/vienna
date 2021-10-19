import {VRouteNotFoundStrategy} from "./v-route-not-found-strategy";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";

export interface VInternalRouterOptions {
    eventBus: VInternalEventbus;
    routeNotFoundStrategy?: VRouteNotFoundStrategy;
}
