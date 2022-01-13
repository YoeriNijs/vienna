import {VRouteRedirect} from '../v-route-redirect';
import {VInvalidRouteException} from '../v-invalid-route-exception';

const setupBaseHref = (href: string) => {
    // eslint-disable-next-line no-undef
    global['window'] = Object.create(window);
    Object.defineProperty(window, 'location', {
        value: { href }
    });
}

describe('VRouteRedirect', () => {

    let routeRedirect: VRouteRedirect;
    let windowOpen: any;

    beforeEach(() => {
        routeRedirect = new VRouteRedirect();

        windowOpen = jest.spyOn(window, 'open');
        windowOpen.mockImplementation(jest.fn());
    });

    describe('#redirectTo', () => {
        it('should redirect to an internal route in same window', () => {
            setupBaseHref('#');
            routeRedirect.redirectTo('#/path');
            expect(windowOpen).toHaveBeenCalledWith('#/path', '_self');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });

        it('should redirect to an internal route in new window', () => {
            setupBaseHref('#');
            routeRedirect.redirectTo('#/path', true);
            expect(windowOpen).toHaveBeenCalledWith('#/path', '_blank');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });

        it('should redirect to an external route in same window', () => {
            setupBaseHref('#');
            routeRedirect.redirectTo('https://www.world.domination', false);
            expect(windowOpen).toHaveBeenCalledWith('https://www.world.domination', '_self');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });

        it('should redirect to an external route in new window', () => {
            setupBaseHref('#');
            routeRedirect.redirectTo('https://www.world.domination', true);
            expect(windowOpen).toHaveBeenCalledWith('https://www.world.domination', '_blank');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });

        it('should redirect to an external route if route does not start with hash sign', () => {
            setupBaseHref('#');
            routeRedirect.redirectTo('does/not/start/with/#', false);
            expect(windowOpen).toHaveBeenCalledWith('does/not/start/with/#', '_self');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });

        it('should not navigate when base is not a valid Vienna base and route is internal', () => {
            setupBaseHref('invalid');
            const redirect = () => routeRedirect.redirectTo('#/path', false);
            expect(redirect).toThrow(new VInvalidRouteException('No Vienna route'));
        });

        it('should navigate when base is not a valid Vienna base and route is external', () => {
            setupBaseHref('invalid');
            routeRedirect.redirectTo('https://vienna.tha.best', false);
            expect(windowOpen).toHaveBeenCalledWith('https://vienna.tha.best', '_self');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });
    });

    describe('#redirectToRoot', () => {
        it('should navigate to Vienna base', () => {
            setupBaseHref('#');
            routeRedirect.redirectToRoot();
            expect(windowOpen).toHaveBeenCalledWith('#', '_self');
            expect(windowOpen).toHaveBeenCalledTimes(1);
        });
    });
});