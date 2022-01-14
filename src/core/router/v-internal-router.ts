import {VNoRouteException} from './v-no-route-exception';
import {VRoute} from './v-route';
import {VRouteNotFoundStrategy} from './v-route-not-found-strategy';
import {Type, VInjector} from "../injector/v-injector";
import {VRouteGuard} from "./v-route-guard";
import {VInternalRouterOptions} from "./v-internal-router-options";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VRouteNotFoundRedirect} from "./v-route-not-found-redirect";
import {VInvalidRouteStrategyException} from "./v-invalid-route-strategy-exception";

export class VInternalRouter {

    constructor(private options: VInternalRouterOptions) {}

    private static isRouteNotFoundRedirectStrategy(strategy: VRouteNotFoundStrategy | VRouteNotFoundRedirect): strategy is VRouteNotFoundRedirect {
        const s = strategy as any;
        return s && s.path && s.path.startsWith('/');
    }

    start(): void {
        // Navigate to initial route
        this.navigate();

        // Listen to route changes
        window.addEventListener('hashchange', () => this.navigate());
    }

    private navigate(): void {
        const url = window.location.hash || '/';
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
        const strategy = this.options.routeNotFoundStrategy;
        if (VInternalRouter.isRouteNotFoundRedirectStrategy(strategy)) {
            window.location.href = `#${strategy.path}`;
        } else if (strategy === VRouteNotFoundStrategy.IGNORE) {
            throw new VNoRouteException(`No route found for url '${url}'`);
        } else if (strategy === VRouteNotFoundStrategy.ROOT) {
            window.location.href = '#/';
        } else {
            const invalidStrategy = strategy ? JSON.stringify(strategy) : 'none';
            throw new VInvalidRouteStrategyException(`Invalid route strategy: '${invalidStrategy}'`);
        }
    }

    private findRoute(url: string): VRoute {
        url = url.startsWith('#') ? url.substring(1, url.length) : url;
        const resolvedRoute = this.options.routes.find((r) => {
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
        eventBus.unsubscribe(VInternalEventName.ROUTE_DATA);
        eventBus.unsubscribe(VInternalEventName.ROUTE_PARAMS);
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
