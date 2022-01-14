import {VInternalRouter} from "../v-internal-router";
import {VInternalRouterOptions} from "../v-internal-router-options";
import {VInternalEventbus} from "../../eventbus/v-internal-eventbus";
import {VRouteNotFoundStrategy} from "../v-route-not-found-strategy";
import {VNoRouteException} from "../v-no-route-exception";
import {VInvalidRouteStrategyException} from "../v-invalid-route-strategy-exception";
import {VInternalEventName} from "../../eventbus/v-internal-event-name";
import {VRoute} from "../v-route";
import {VRouteGuard} from "../v-route-guard";

class TrueGuard implements VRouteGuard {
    guard(): boolean {
        return true;
    }
}

class FalseGuard implements VRouteGuard {
    guard(): boolean {
        return false;
    }
}

class TruePromiseGuard implements VRouteGuard {
    guard(): Promise<boolean> {
        return Promise.resolve(true);
    }
}

class FalsePromiseGuard implements VRouteGuard {
    guard(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

describe('VInternalRouter', () => {
    let eventBus: VInternalEventbus;

    beforeEach(() => eventBus = new VInternalEventbus());

    afterEach(() => jest.clearAllMocks());

    const createWindow = (hash: string): void => {
        // eslint-disable-next-line no-undef
        global['window'] = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: { hash, href: jest.fn() }
        });

        window.addEventListener = jest.fn();
    }

    const createRouter = (options: Partial<VInternalRouterOptions> = {}): void => {
        const router = new VInternalRouter(Object.assign({ eventBus, routes: [] }, options));
        router.start();
    }

    const setupRouter = (hash: string, options: Partial<VInternalRouterOptions> = {}): void => {
        createWindow(hash);
        createRouter(options);
    }

    describe('Route not found strategies', () => {
        it('should navigate to root if route is invalid and strategy is root', () => {
            setupRouter('/invalid-route', { routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT });
            expect(window.location.href).toEqual('#/');
        });

        it('should ignore if route is invalid and strategy is ignore', () => {
            const navigate = () => setupRouter('/invalid-route', { routeNotFoundStrategy: VRouteNotFoundStrategy.IGNORE });
            expect(navigate).toThrow(new VNoRouteException('No route found for url \'/invalid-route\''));
        });

        it('should navigate to configured path if route is invalid and strategy is path', () => {
            setupRouter('/invalid-route', { routeNotFoundStrategy: { path: '/not-found' } });
            expect(window.location.href).toEqual('#/not-found');
        });

        it('should throw error if path if route is invalid and strategy is invalid path', () => {
            const navigate = () => setupRouter('/invalid-route', { routeNotFoundStrategy: { path: 'not-found' } });
            expect(navigate).toThrow(new VInvalidRouteStrategyException('Invalid route strategy: \'{"path":"not-found"}\''));
        });

        it.each(
            [undefined, null]
        )('should throw error if path if route is invalid and strategy is %s', (strategy) => {
            const navigate = () => setupRouter('/invalid-route', { routeNotFoundStrategy: strategy });
            expect(navigate).toThrow(new VInvalidRouteStrategyException('Invalid route strategy: \'none\''));
        });
    });

    describe('Navigate', () => {
        it('should navigate if route is configured and there are no guards', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setupRouter('/custom-component', {
                routes: [ { path: '/custom-component', component: jest.fn() }]
            });
        });

        it('should navigate if route is configured and guard is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TrueGuard]
                    }
                ]
            });
        });

        it('should not navigate if route is configured and guard is false', () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [FalseGuard]
                    }
                ]
            });
        });

        it('should not navigate if route is configured and one guard is false', () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TrueGuard, FalseGuard, TrueGuard]
                    }
                ]
            });
        });

        it('should navigate if route is configured and promise guard is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TruePromiseGuard]
                    }
                ]
            });
        });

        it('should not navigate if route is configured and promise guard is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [FalsePromiseGuard]
                    }
                ]
            });
        });

        it('should not navigate if route is configured and one promise guard is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TruePromiseGuard, FalsePromiseGuard, TruePromiseGuard]
                    }
                ]
            });
        });

        it('should navigate if route is configured and all guards are true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setupRouter('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TruePromiseGuard, TrueGuard, TruePromiseGuard]
                    }
                ]
            });
        });
    });
});