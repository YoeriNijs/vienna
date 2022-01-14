import {VRouteNotFoundStrategy} from "./v-route-not-found-strategy";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VRoute} from "./v-route";
import {VRouteNotFoundRedirect} from "./v-route-not-found-redirect";

export interface VInternalRouterOptions {
    eventBus: VInternalEventbus;
    routes: VRoute[];
    routeNotFoundStrategy?: VRouteNotFoundStrategy | VRouteNotFoundRedirect;
}
