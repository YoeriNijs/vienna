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
        this.findRoute(url).then(route => {
            if (route === null) {
                this.handleRouteNotFound(url);
            } else {
                this.dispatchNavigationAction(route);
            }
        });
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

        let previouslyVisitedRoute: VRoute = null;
        return segments.reduce((resolvedRoute, segment) => {
            return resolvedRoute.then(route => {
                if (route === null) {
                    return Promise.resolve(null);
                } else {
                    if (route === previouslyVisitedRoute) {
                        return Promise.resolve(previouslyVisitedRoute);
                    }
                    return this.findCurrentRoute(segment, route).then(currentRoute => {
                        const segmentIndex = segments.indexOf(segment);
                        const hasChildren = segmentIndex < segments.length - 1;
                        return currentRoute && hasChildren
                            ? this.findChildRoute(currentRoute, segments, segmentIndex)
                                .then(child => previouslyVisitedRoute = child)
                            : Promise.resolve(currentRoute)
                                .then(current => previouslyVisitedRoute = current)
                    });
                }
            })
        }, Promise.resolve(undefined));
    }

    private findCurrentRoute(segment: string, context: VRoute): Promise<VRoute | null> {
        const children = context && context.children || this.options.routes;
        const route = this.findRouteForSegment(segment, children);
        return this.isAllowedToNavigateTo(route)
            .then(isAllowed => isAllowed
                ? Promise.resolve(route)
                : Promise.resolve(null));
    }

    private findChildRoute(parent: VRoute, segments: string[], segmentIndex: number): Promise<VRoute | null> {
        return this.isAllowedToNavigateTo(parent)
            .then(isAllowedForParent => {
                const childSegment = segments[segmentIndex + 1];
                const child = this.findRouteForSegment(childSegment, parent.children);
                return isAllowedForParent && child
                    ? this.isAllowedToNavigateTo(child)
                        .then(isAllowedForChild => isAllowedForChild
                            ? Promise.resolve(child)
                            : Promise.resolve(null))
                    : isAllowedForParent
                        ? Promise.resolve(parent)
                        : Promise.resolve(null);
            });
    }

    private findRouteForSegment(url: string, routes: VRoute[]): VRoute | null {
        const resolvedRoute = routes.find((r) => {
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
