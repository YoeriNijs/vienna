import {VInternalComponent} from '../internal/v-internal-component';
import {VNoRouteException} from './v-no-route-exception';
import {VRoute} from './v-route';
import {VRouteNotFoundStrategy} from './v-route-not-found-strategy';
import {VRouterEvents, VRouterNavigatedEvent} from './v-router-event';

@VInternalComponent({
    name: 'VRouter',
})
export class VRouter {
    private _routes: VRoute[] = [];

    constructor(private routeNotFoundStrategy?: VRouteNotFoundStrategy) {
        window.addEventListener('hashchange', () => this.navigate());
        window.location.href = window.location.hash.slice(1) === '/'
            ? '#'
            : `#/${window.location.hash.slice(1)}` || '#';
    }

    addRoute(route: VRoute): VRouter {
        this._routes.push(route);
        return this;
    }

    private navigate(): void {
        const url = window.location.hash.slice(1) || '/';
        const route = this.findRoute(url);
        if (route === null) {
            if (this.routeNotFoundStrategy === VRouteNotFoundStrategy.IGNORE) {
                throw new VNoRouteException(`No route found for url '${url}'`);
            } else {
                // Default or root: navigate to root
                window.location.href = '#';
            }
        } else {
            this.dispatchNavigationAction(route);
        }
    }

    private findRoute(url: string): VRoute {
        const resolvedRoute = this._routes.find((r) => {
            const paramIndex = url.indexOf('?');
            if (paramIndex === -1) {
                return r.path === url;
            } else {
                return r.path === url.substring(0, paramIndex);
            }
        });
        if (resolvedRoute) {
            return resolvedRoute;
        }
        return null;
    }

    private dispatchNavigationAction(route: VRoute): void {
        const event: VRouterNavigatedEvent<VRoute> = new CustomEvent(VRouterEvents.NAVIGATED, {detail: route});
        document.dispatchEvent(event);
    }
}
