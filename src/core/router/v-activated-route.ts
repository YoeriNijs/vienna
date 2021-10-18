import {VInjectable} from "../injector/v-injectable-decorator";
import {BehaviorSubject, fromEvent, tap} from "rxjs";
import {VRouterEvents, VRouterNavigatedEvent} from "./v-router-event";
import {VRouteParams} from "./v-route-params";
import {VRouteData} from "./v-route-data";
import {VRoute} from "./v-route";

@VInjectable()
export class VActivatedRoute {
    private _data$: BehaviorSubject<VRouteData> = new BehaviorSubject({});
    private _params$: BehaviorSubject<VRouteParams> = new BehaviorSubject({});

    get data$(): BehaviorSubject<VRouteData> {
        return this._data$;
    }

    get params$(): BehaviorSubject<VRouteParams> {
        return this._params$;
    }

    constructor() {
        fromEvent(document, VRouterEvents.NAVIGATED).pipe(
            tap(() => this.setParams()),
            tap((event: CustomEvent) => this.setData(event))
        ).subscribe();
    }

    private setParams(): void {
        const firstQuestionMark = window.location.hash.indexOf('?');
        if (firstQuestionMark === -1) {
            this.params$.next({});
        } else {
            const partialLocation = window.location.hash.substring(firstQuestionMark, window.location.hash.length);
            const searchParams = new URLSearchParams(partialLocation);
            const params = Object.fromEntries(searchParams.entries());
            this._params$.next(params);
        }
    }

    private setData(event: VRouterNavigatedEvent<VRoute>): void {
        const route: VRoute = event.detail;
        if (route.data) {
            this._data$.next(route.data);
        } else {
            this._data$.next({});
        }
    }

}
