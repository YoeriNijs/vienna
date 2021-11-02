import {VNoRouteException} from './v-no-route-exception';
import {VRoute} from './v-route';
import {VRouteNotFoundStrategy} from './v-route-not-found-strategy';
import {Type, VInjector} from "../injector/v-injector";
import {VRouteGuard} from "./v-route-guard";
import {VInternalRouterOptions} from "./v-internal-router-options";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";

export class VRouter {
    private _routes: VRoute[] = [];

    constructor(private options: VInternalRouterOptions) {
        window.location.href = window.location.hash.slice(1) === '/'
            ? '#'
            : `#/${window.location.hash.slice(1)}` || '#';

        window.addEventListener('hashchange', () => this.navigate());
    }

    addRoute(route: VRoute): VRouter {
        this._routes.push(route);
        return this;
    }

    private navigate(): void {
        const url = window.location.hash.slice(1) || '/';
        const route = this.findRoute(url);
        if (route === null) {
            this.handleRouteNotFound(url);
        } else {
            this.isAllowedToNavigateTo(route).then(yes => {
                if (yes) {
                    this.dispatchNavigationAction(route);
                }
            });
        }
    }

    private handleRouteNotFound(url: string): void {
        if (this.options.routeNotFoundStrategy === VRouteNotFoundStrategy.IGNORE) {
            throw new VNoRouteException(`No route found for url '${url}'`);
        } else {
            // Default or root: navigate to root
            window.location.href = '#';
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
        return resolvedRoute ? resolvedRoute : null;
    }

    private dispatchNavigationAction(route: VRoute): void {
        const eventBus: VInternalEventbus = this.options.eventBus;
        eventBus.publish<VRoute>(VInternalEventName.NAVIGATED, route);
    }

    private isAllowedToNavigateTo(route: VRoute): Promise<boolean> {
        const guards: Type<VRouteGuard>[] = route.guards || [];
        if (guards.length < 1) {
            return Promise.resolve(true);
        }

        const promises: Promise<boolean>[] = guards
            .map(g => VInjector.resolve<VRouteGuard>(g))
            .map(g => Promise.resolve(g.guard(route)))
            .reduce((guards: any, guard: any) => guards.concat(guard), []);

        return promises.reduce((prev, curr) => {
            return prev.then(res1 => curr.then(res2 => res1 === true && res2 === true));
        }, Promise.resolve(true));
    }
}
