import {VInternalComponent} from "../internal/v-internal-component";
import {VRoute} from "./v-route";
import {VRouterEvents, VRouterNavigatedEvent} from "./v-router-event";

@VInternalComponent({
	name: 'VRouter'
})
export class VRouter {
	private _routes: VRoute[] = [];

	constructor() {
		window.addEventListener('hashchange', (e) => this.navigate());
		window.location.href = '#';
	}

	addRoute(route: VRoute): VRouter {
		this._routes.push(route);
		return this;
	}

	navigate(): void {
		const url = window.location.hash.slice(1) || "/";
		const route = this.findRoute(url);
		this.dispatchNavigationAction(route);
	}

	private findRoute(url: string): VRoute {
		const resolvedRoute = this._routes.find(r => r.path === url);
		if (resolvedRoute) {
			return resolvedRoute;
		} else {
			return { path: '', component: {} }
		}
	}

	private dispatchNavigationAction(route: VRoute): void {
		const event: VRouterNavigatedEvent<VRoute> = new CustomEvent(VRouterEvents.NAVIGATED, { detail: route });
		document.dispatchEvent(event);
	}
}
