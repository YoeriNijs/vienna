import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VRoute} from "./v-route";
import {VRouteStrategy} from "./v-route-strategy";

export interface VInternalRouterOptions {
    eventBus: VInternalEventbus;
    routes: VRoute[];
    routeNotFoundStrategy?: VRouteStrategy;
}
