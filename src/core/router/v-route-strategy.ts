import {VRouteNotFoundStrategy} from "./v-route-not-found-strategy";
import {VRouteNotFoundRedirect} from "./v-route-not-found-redirect";
import {VCustomRouteRedirect} from "./v-custom-route-redirect";

export type VRouteStrategy = VRouteNotFoundStrategy | VRouteNotFoundRedirect | VCustomRouteRedirect;
