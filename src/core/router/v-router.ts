import {VInternalComponent} from '../internal/v-internal-component';
import {VNoRouteException} from './v-no-route-exception';
import {VRoute} from './v-route';
import {VRouteNotFoundStrategy} from './v-route-not-found-strategy';
import {VRouterEvents, VRouterNavigatedEvent} from './v-router-event';
import {filter, from, fromEvent, isObservable, mergeMap, Observable, of, reduce, tap} from "rxjs";
import {Type, VComponentInjector} from "../injector/v-component-injector";
import {VCanActivateGuard} from "./v-can-activate-guard";

@VInternalComponent({
    name: 'VRouter',
})
export class VRouter {
    private _routes: VRoute[] = [];

    constructor(private routeNotFoundStrategy?: VRouteNotFoundStrategy) {
        window.location.href = window.location.hash.slice(1) === '/'
            ? '#'
            : `#/${window.location.hash.slice(1)}` || '#';

        fromEvent(window, 'hashchange').subscribe(() => this.navigate());
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
            this.canActivate(route).pipe(
                filter(canActivate => canActivate),
                tap(() => this.dispatchNavigationAction(route))
            ).subscribe();
        }
    }

    private handleRouteNotFound(url: string): void {
        if (this.routeNotFoundStrategy === VRouteNotFoundStrategy.IGNORE) {
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
        if (resolvedRoute) {
            return resolvedRoute;
        }
        return null;
    }

    private dispatchNavigationAction(route: VRoute): void {
        const event: VRouterNavigatedEvent<VRoute> = new CustomEvent(VRouterEvents.NAVIGATED, {detail: route});
        document.dispatchEvent(event);
    }

    private canActivate(route: VRoute): Observable<boolean> {
        const guards: Type<VCanActivateGuard>[] = route.canActivate || [];
        if (guards.length < 1) {
            return of(true);
        }

        return from(guards).pipe(
            mergeMap((g) => {
                const guard = VComponentInjector.resolve<VCanActivateGuard>(g);
                const canActivate = guard.canActivate(route);
                return isObservable(canActivate)
                    ? canActivate
                    : of(canActivate);
            }),
            reduce((prev, curr) => prev && curr, true),
        );
    }
}
