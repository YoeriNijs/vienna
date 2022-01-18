import {VInjectable} from "../injector/v-injectable-decorator";
import {VRoute} from "./v-route";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VRouteData} from "./v-route-data";
import {VQueryParam} from "./v-query-param";
import {VRouteParam} from "./v-route-param";

interface VInternalRouteParam {
    key: string;
    index: number;
}

@VInjectable({singleton: true})
export class VActivatedRoute {

    private _eventBus: VInternalEventbus;
    private _applicationRoutes: VRoute[] = [];

    constructor(protected eventBus: VInternalEventbus) {
        this._eventBus = eventBus;

        eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATION_ENDED, (route: VRoute) => {
            this.setRouteParams();
            this.setQueryParams();
            this.setData(route);

            // Unsubscribe old route subscriptions since they are outdated
            eventBus.unsubscribe(VInternalEventName.ROUTE_DATA);
            eventBus.unsubscribe(VInternalEventName.ROUTE_PARAMS);
            eventBus.unsubscribe(VInternalEventName.QUERY_PARAMS);
        });
    }

    initialize(applicationRoutes: VRoute[]): void {
        this._applicationRoutes = applicationRoutes;
    }

    public data(callBack: (data: VRouteData) => void): (data: VRouteData) => void {
        this._eventBus.subscribe<VRouteData>(VInternalEventName.ROUTE_DATA, callBack);
        return callBack;
    }

    public queryParams(callBack: (params: VQueryParam) => void): (params: VQueryParam) => void {
        this._eventBus.subscribe<VRouteData>(VInternalEventName.QUERY_PARAMS, callBack);
        return callBack;
    }

    public params(callBack: (params: VRouteParam[]) => void): (params: VRouteParam[]) => void {
        this.eventBus.subscribe<VRouteParam[]>(VInternalEventName.ROUTE_PARAMS, callBack);
        return callBack;
    }

    private setQueryParams(): void {
        const firstQuestionMark = window.location.hash.indexOf('?');
        if (firstQuestionMark === -1) {
            this._eventBus.publish(VInternalEventName.QUERY_PARAMS, {});
        } else {
            const partialLocation = window.location.hash.substring(firstQuestionMark, window.location.hash.length);
            const searchParams = new URLSearchParams(partialLocation);
            const params = Object.fromEntries(searchParams.entries());
            this._eventBus.publish(VInternalEventName.QUERY_PARAMS, params);
        }
    }

    private setData(route: VRoute): void {
        if (route && route.data) {
            this._eventBus.publish(VInternalEventName.ROUTE_DATA, route.data);
        } else {
            this._eventBus.publish(VInternalEventName.ROUTE_DATA, {});
        }
    }

    private setRouteParams(): void {
        const internalRouteParams = this.walkRouteTreeForParams();
        const url = window.location.hash || '/';
        const segments = url.split('/')
            .filter(v => v && v.length > 0)
            .map(v => `${v}`);
        const routeParams: VRouteParam[] = internalRouteParams
            .map(r => ({ id: r.key, value: segments[--r.index] }))
            .filter(v => v.value);
        if (routeParams && routeParams.length > 0) {
            this.eventBus.publish(VInternalEventName.ROUTE_PARAMS, routeParams);
        } else {
            this.eventBus.publish(VInternalEventName.ROUTE_PARAMS, []);
        }
    }

    private walkRouteTreeForParams(): VInternalRouteParam[] {
        const internalRouteParams: VInternalRouteParam[] = [];
        const doWalk = (routes: VRoute[], depth: number) => {
            routes.forEach(r => {
                const path = r.path;
                if (path.startsWith('/:')) {
                    const pathName = path.substring(2, path.length);
                    internalRouteParams.push({key: pathName, index: depth + 1});
                }
                if (r.children && r.children.length > 0) {
                    doWalk(r.children, ++depth);
                }
            });
        }
        doWalk(this._applicationRoutes, 1);
        return internalRouteParams;
    }
}
