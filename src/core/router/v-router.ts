import {VInternalComponent} from "../internal/v-internal-component";
import { VNoRouteException } from "./v-no-route-exception";
import {VRoute} from "./v-route";
import { VRouteNotFoundStrategy } from "./v-route-not-found-strategy";
import {VRouterEvents, VRouterNavigatedEvent} from "./v-router-event";

@VInternalComponent({
	name: 'VRouter'
})
export class VRouter {
	private _routes: VRoute[] = [];

	constructor(private routeNotFoundStrategy?: VRouteNotFoundStrategy) {
		window.addEventListener('hashchange', () => this.navigate());
		window.location.href = `#/${window.location.hash.slice(1)}` || '#';
	}

	addRoute(route: VRoute): VRouter {
		this._routes.push(route);
		return this;
	}

	navigate(): void {
		const url = window.location.hash.slice(1) || "/";
		const route = this.findRoute(url);
		if (route === null) {
			if (this.routeNotFoundStrategy === VRouteNotFoundStrategy.ROOT) {
				window.location.href = '#';
			} else {
				throw new VNoRouteException(`No route found for url '${url}'`);
			}
		} else {
			this.dispatchNavigationAction(route);
		}
	}

	private findRoute(url: string): VRoute {
		const resolvedRoute = this._routes.find(r => r.path === url);
		if (resolvedRoute) {
			return resolvedRoute;
		} else {
			return null;
		}
	}

	private dispatchNavigationAction(route: VRoute): void {
		const event: VRouterNavigatedEvent<VRoute> = new CustomEvent(VRouterEvents.NAVIGATED, { detail: route });
		document.dispatchEvent(event);
	}
}
