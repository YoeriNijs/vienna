import { Type } from "../injector/v-component-injector";
import {VComponentType, VRoute} from "../router/v-route";
import { VRouteNotFoundStrategy } from "../router/v-route-not-found-strategy";

export interface VApplicationConfig {
	declarations: Type<VComponentType>[];
	routes: VRoute[];
	routeNotFoundStrategy?: VRouteNotFoundStrategy;
}
