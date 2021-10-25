import {VInjectable} from "../injector/v-injectable-decorator";
import {VRoute} from "./v-route";
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VRouteData} from "./v-route-data";
import {VRouteParams} from "./v-route-params";

@VInjectable()
export class VActivatedRoute {

    private _eventBus: VInternalEventbus;

    constructor(protected eventBus: VInternalEventbus) {
        this._eventBus = eventBus;

        eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATED, (route: VRoute) => {
            this.setParams();
            this.setData(route);
        });
    }

    public data(callBack: (data: VRouteData) => void): (data: VRouteData) => void {
        this._eventBus.subscribe<VRouteData>(VInternalEventName.ROUTE_DATA, callBack);
        return callBack;
    }

    public params(callBack: (params: VRouteParams) => void): (params: VRouteParams) => void {
        this._eventBus.subscribe<VRouteData>(VInternalEventName.ROUTE_PARAMS, callBack);
        return callBack;
    }

    private setParams(): void {
        const firstQuestionMark = window.location.hash.indexOf('?');
        if (firstQuestionMark === -1) {
            this._eventBus.publish(VInternalEventName.ROUTE_PARAMS, {});
        } else {
            const partialLocation = window.location.hash.substring(firstQuestionMark, window.location.hash.length);
            const searchParams = new URLSearchParams(partialLocation);
            const params = Object.fromEntries(searchParams.entries());
            this._eventBus.publish(VInternalEventName.ROUTE_PARAMS, params);
        }
    }

    private setData(route: VRoute): void {
        if (route && route.data) {
            this._eventBus.publish(VInternalEventName.ROUTE_DATA, route.data);
        } else {
            this._eventBus.publish(VInternalEventName.ROUTE_DATA, {});
        }
    }

}
