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

    start(): Promise<void> {
        return this.navigate()
            .then(() => window.addEventListener('hashchange', () => this.navigate()))
    }

    private navigate(): Promise<void> {
        const url = window.location.hash || '/';
        return this.findRoute(url).then(route => route === null
            ? this.handleRouteNotFound(url)
            : this.dispatchNavigationAction(route));
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

    private findRoute(url: string): Promise<VRoute | null> {
        url = url.startsWith('#') ? url.substring(1, url.length) : url;
        const segments = url.split('/')
            .filter(v => v && v.length > 0)
            .map(v => `/${v}`);

        if (!segments || segments.length < 1) {
            segments.push('/'); // Navigate to root instead
        }

        let parentRoute: VRoute = null;
        return segments.reduce((resolvedRoute, segment) => {
            return resolvedRoute.then(route => {
                const segmentIndex = segments.indexOf(segment);
                const hasChildren = segmentIndex < segments.length - 1;
                if (route === null) {
                    return Promise.resolve(null);
                } else if (hasChildren) {
                    return this.findRouteWithAuthCheck(segment, parentRoute)
                        .then(currentRoute => currentRoute
                            ? this.findChildRoute(currentRoute, segments, segmentIndex)
                                .then(child => parentRoute = child === null ? null : currentRoute)
                            : Promise.resolve(null));
                } else if (parentRoute === null) {
                    return this.findRouteWithAuthCheck(segment, parentRoute)
                        .then(currentRoute => parentRoute = currentRoute);
                } else if (route === parentRoute) {
                    return this.findRouteWithoutAuthCheck(segment, parentRoute);
                } else {
                    return this.findRouteWithoutAuthCheck(segment, parentRoute)
                        .then(currentRoute => parentRoute = currentRoute);
                }
            })
        }, Promise.resolve(undefined));
    }

    private findRouteWithoutAuthCheck(segment: string, context: VRoute): Promise<VRoute | null> {
        const children = context && context.children || this.options.routes;
        const route = this.findRouteForSegment(segment, children);
        return Promise.resolve(route);
    }

    private findRouteWithAuthCheck(segment: string, context: VRoute): Promise<VRoute | null> {
        const children = context && context.children || this.options.routes;
        const route = this.findRouteForSegment(segment, children);
        return this.isAllowedToNavigateTo(route)
            .then(isAllowed => isAllowed
                ? Promise.resolve(route)
                : Promise.resolve(null));
    }

    private findChildRoute(parent: VRoute, segments: string[], segmentIndex: number): Promise<VRoute | null> {
        const childSegment = segments[segmentIndex + 1];
        if (!childSegment) {
            return Promise.resolve(null);
        }
        const child = this.findRouteForSegment(childSegment, parent.children);
        return child ? this.isAllowedToNavigateTo(child)
                .then(isAllowedForChild => isAllowedForChild
                    ? Promise.resolve(child)
                    : Promise.resolve(null))
            : Promise.resolve(parent);
    }

    private findRouteForSegment(url: string, routes: VRoute[]): VRoute | null {
        if (!url || !routes) {
            return null;
        }
        return this.findExactRoute(routes, url) || this.findRouteParam(routes);
    }

    private findRouteParam(routes: VRoute[]): VRoute | null {
        const routeParam = routes.find((r) => {
            const lowerPath = r.path.toLowerCase();
            return lowerPath.startsWith('/:') ? r : null;
        });
        return routeParam ? routeParam : null;
    }

    private findExactRoute(routes: VRoute[], url: string): VRoute | null {
        const exactRoute = routes.find((r) => {
            const lowerPath = r.path.toLowerCase();
            const lowerUrl = url.toLowerCase();
            const paramIndex = url.indexOf('?');
            if (paramIndex === -1) {
                return lowerPath === lowerUrl;
            } else {
                return lowerPath === lowerUrl.substring(0, paramIndex);
            }
        });
        return exactRoute ? exactRoute : null;
    }

    private dispatchNavigationAction(route: VRoute): void {
        const eventBus: VInternalEventbus = this.options.eventBus;
        eventBus.unsubscribe(VInternalEventName.ROUTE_DATA);
        eventBus.unsubscribe(VInternalEventName.ROUTE_PARAMS);
        eventBus.unsubscribe(VInternalEventName.QUERY_PARAMS);
        eventBus.publish<VRoute>(VInternalEventName.NAVIGATED, route);
    }

    private isAllowedToNavigateTo(route: VRoute): Promise<boolean> {
        if (!route) {
            return Promise.resolve(false);
        }

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
