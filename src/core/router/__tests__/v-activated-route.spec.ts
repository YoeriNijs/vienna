import {VInternalEventbus} from "../../eventbus/v-internal-eventbus";
import {VActivatedRoute} from "../v-activated-route";
import {VInternalEventName} from "../../eventbus/v-internal-event-name";
import {VRoute} from "../v-route";
import {VRouteData} from "../v-route-data";
import {VQueryParam} from "../v-query-param";

describe('VActivatedRoute', () => {
    let eventBus: VInternalEventbus;
    let activatedRoute: VActivatedRoute;

    beforeEach(() => {
        eventBus = new VInternalEventbus();
        activatedRoute = new VActivatedRoute(eventBus);
    });

    it('should update data if a navigation event occurs', () => {
        let lastKnownData = {};
        activatedRoute.data(data => lastKnownData = data);
        const route: VRoute = {path: '', component: {}, data: {someKey: 'someValue'}};
        eventBus.publish(VInternalEventName.NAVIGATION_ENDED, route);
        expect(lastKnownData).toEqual({someKey: 'someValue'});
    });

    it.each([
        {}, null, undefined, {path: '', component: {}, data: null},
        {path: '', component: {}, data: undefined}, {path: '', component: {}, data: {}}
    ])('should reset data if the navigation event does not hold data', data => {
        let lastKnownData: VRouteData = {someKey: 'someValue'};
        activatedRoute.data(data => lastKnownData = data);
        eventBus.publish(VInternalEventName.NAVIGATION_ENDED, data);
        expect(lastKnownData).toEqual({});
    });

    it('should update queryParams if a navigation event occurs', () => {
        // eslint-disable-next-line no-undef
        Object.defineProperty(global, "window", {
            value: {location: {hash: '#?key=value'}}
        });
        let lastKnownParams: VQueryParam = {};
        activatedRoute.queryParams(params => lastKnownParams = params);
        eventBus.publish(VInternalEventName.NAVIGATION_ENDED, {});
        expect(lastKnownParams).toEqual({key: 'value'});
    });

    it('should update multiple queryParams', () => {
        // eslint-disable-next-line no-undef
        Object.defineProperty(global, "window", {
            value: {location: {hash: '#?key1=value1&key2=value2'}}
        });
        let lastKnownParams: VQueryParam = {};
        activatedRoute.queryParams(params => lastKnownParams = params);
        eventBus.publish(VInternalEventName.NAVIGATION_ENDED, {});
        expect(lastKnownParams).toEqual({key1: 'value1', key2: 'value2'});
    });

    it('should reset queryParams if there is none', () => {
        // eslint-disable-next-line no-undef
        Object.defineProperty(global, "window", {
            value: {location: {hash: '#'}}
        });
        let lastKnownParams: VQueryParam = {key: 'value'};
        activatedRoute.queryParams(params => lastKnownParams = params);
        eventBus.publish(VInternalEventName.NAVIGATION_ENDED, {});
        expect(lastKnownParams).toEqual({});
    });
});
