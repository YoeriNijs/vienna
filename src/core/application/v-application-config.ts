import {VComponentType, VRoute} from "../router/v-route";
import { VRouteNotFoundStrategy } from "../router/v-route-not-found-strategy";

export interface VApplicationConfig {
	declarations: VComponentType[];
	routes: VRoute[];
	routeNotFoundStrategy?: VRouteNotFoundStrategy;
}
