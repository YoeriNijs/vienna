import {VInternalRouter} from "../v-internal-router";
import {VInternalRouterOptions} from "../v-internal-router-options";
import {VInternalEventbus} from "../../eventbus/v-internal-eventbus";
import {VRouteGuard} from "../v-route-guard";
import {VInvalidRouteStrategyException} from "../v-invalid-route-strategy-exception";
import {VRouteNotFoundStrategy} from "../v-route-not-found-strategy";
import {VNoRouteException} from "../v-no-route-exception";
import {VRoute} from "../v-route";
import {VInternalEventName} from "../../eventbus/v-internal-event-name";

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

    const setup = (windowHash: string, options: Partial<VInternalRouterOptions> = {}): Promise<void> => {
        // eslint-disable-next-line no-undef
        global['window'] = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: { hash: windowHash, href: jest.fn() }
        });

        window.addEventListener = jest.fn();

        const router = new VInternalRouter(Object.assign({ eventBus, routes: [] }, options));
        return router.start();
    }

    describe('Route not found strategies', () => {
        it('should navigate to root if route is invalid and strategy is root', async () => {
            setup('/invalid-route', { routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT })
                .then(() => expect(window.location.href).toEqual('#/'))
                .catch(e => fail(e));
        });

        it('should ignore if route is invalid and strategy is ignore', async () => {
            setup('/invalid-route', { routeNotFoundStrategy: VRouteNotFoundStrategy.IGNORE })
                .then(e => fail(e))
                .catch(e => expect(e).toEqual(new VNoRouteException('No route found for url \'/invalid-route\'')));
        });

        it('should navigate to configured path if route is invalid and strategy is path', async () => {
            setup('/invalid-route', { routeNotFoundStrategy: { path: '/not-found' } })
                .then(() => expect(window.location.href).toEqual('#/not-found'))
                .catch(e => fail(e));
        });

        it('should navigate to configured path if route is invalid and strategy is redirectTo', async () => {
            setup('/invalid-route', { routeNotFoundStrategy: { redirectTo: () => '/not-found' } })
                .then(() => expect(window.location.href).toEqual('#/not-found'))
                .catch(e => fail(e));
        });

        it('should throw error if path if route is invalid and strategy is invalid path', async () => {
            setup('/invalid-route', { routeNotFoundStrategy: { path: 'not-found' } })
                .then(e => fail(e))
                .catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'{"path":"not-found"}\'')))
        });

        it.each(
            [undefined, null]
        )('should throw error if path if route is invalid and strategy is %s', async (strategy) => {
            setup('/invalid-route', { routeNotFoundStrategy: strategy })
                .then(e => fail(e))
                .catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')))
        });
    });

    describe('Navigate', () => {
        it('should navigate if route is configured and there are no guards', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setup('/custom-component', {
                routes: [ { path: '/custom-component', component: jest.fn() }]
            }).catch(e => fail(e));
        });

        it('should navigate if route is configured and guard is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TrueGuard]
                    }
                ]
            }).catch(e => fail(e));
        });

        it('should fire VInvalidRouteStrategyException if guard is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [FalseGuard]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should fire VInvalidRouteStrategyException if one guard of set is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TrueGuard, FalseGuard, TrueGuard]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should navigate if route is configured and promise guard is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TruePromiseGuard]
                    }
                ]
            }).catch(e => fail(e));
        });

        it('should fire VInvalidRouteStrategyException if promise guard is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [FalsePromiseGuard]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should fire VInvalidRouteStrategyException if one promise guard is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TruePromiseGuard, FalsePromiseGuard, TruePromiseGuard]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should navigate if route is configured and all guards are true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/custom-component');
                done();
            });
            setup('/custom-component', {
                routes: [
                    {
                        path: '/custom-component',
                        component: jest.fn(),
                        guards: [TruePromiseGuard, TrueGuard, TruePromiseGuard]
                    }
                ]
            }).catch(e => fail(e));
        });
    });

    describe('Subroutes', () => {
        it('should navigate if subroute is configured and parent and child have no guards', done => {
           eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
               expect(r.path).toEqual('/child');
               done();
           });
           setup('/parent/child', {
               routes: [
                   {
                       path: '/parent',
                       component: jest.fn(),
                       children: [ { path: '/child', component: jest.fn() }]
                   }
               ]
           });
        });

        it('should navigate if subroute is configured and parent has guard that is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/child');
                done();
            });
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [ { path: '/child', component: jest.fn() }]
                    }
                ]
            });
        });

        it('should fire VInvalidRouteStrategyException if subroute is configured and parent has guard that is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [FalseGuard],
                        children: [ { path: '/child', component: jest.fn() }]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should fire VInvalidRouteStrategyException if subroute is configured and parent has guard that is true and child has guard that is false', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [ { path: '/child', component: jest.fn(), guards: [FalseGuard] }]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should fire VInvalidRouteStrategyException if subroute is configured and parent has guard that is promise false and child has guard that is true', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [FalsePromiseGuard],
                        children: [ { path: '/child', component: jest.fn(), guards: [TrueGuard] }]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should navigate if subroute is configured and parent has guard that is true and child has guard that is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/child');
                done();
            });
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [ { path: '/child', component: jest.fn(), guards: [TrueGuard] }]
                    }
                ]
            });
        });

        it('should navigate if subroute is configured and parent has guard that is promise true and child has guard that is true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/child');
                done();
            });
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TruePromiseGuard],
                        children: [ { path: '/child', component: jest.fn(), guards: [TrueGuard] }]
                    }
                ]
            });
        });

        it('should navigate if subroute is configured and parent has guard that is promise true and child has guard that is promise true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/child');
                done();
            });
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TruePromiseGuard],
                        children: [ { path: '/child', component: jest.fn(), guards: [TruePromiseGuard] }]
                    }
                ]
            });
        });

        it('should navigate if subroute is configured and parent has guard that is true and child has guard that is promise true', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/child');
                done();
            });
            setup('/parent/child', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [ { path: '/child', component: jest.fn(), guards: [TruePromiseGuard] }]
                    }
                ]
            });
        });

        it('should navigate if subroute is configured and all parents have true guards', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/child2');
                done();
            });
            setup('/parent/child1/child2', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [
                            {
                                path: '/child1',
                                component: jest.fn(),
                                guards: [TrueGuard],
                                children: [
                                    {
                                        path: '/child2',
                                        component: jest.fn()
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        });

        it('should fire VInvalidRouteStrategyException if subroute is configured and one of parents has false guard', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/parent/child1/child2', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [
                            {
                                path: '/child1',
                                component: jest.fn(),
                                guards: [FalseGuard],
                                children: [
                                    {
                                        path: '/child2',
                                        component: jest.fn()
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should fire VInvalidRouteStrategyException if subroute is configured and child has false guard', async () => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, () => fail('Should not be called'));
            setup('/parent/child1/child2', {
                routes: [
                    {
                        path: '/parent',
                        component: jest.fn(),
                        guards: [TrueGuard],
                        children: [
                            {
                                path: '/child1',
                                component: jest.fn(),
                                guards: [TrueGuard],
                                children: [
                                    {
                                        path: '/child2',
                                        component: jest.fn(),
                                        guards: [FalseGuard]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }).catch(e => expect(e).toEqual(new VInvalidRouteStrategyException('Invalid route strategy: \'none\'')));
        });

        it('should navigate with route param', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/:id');
                done();
            });
            setup('/blog/:id', {
                routes: [
                    {
                        path: '/blog',
                        component: jest.fn(),
                        guards: [],
                        children: [
                            {
                                path: '/:id',
                                component: jest.fn(),
                                guards: [],
                                children: []
                            }
                        ]
                    }
                ]
            });
        });

        it('should navigate with query param', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/page');
                done();
            });
            setup('/page?message=Hello%20there', {
                routes: [
                    {
                        path: '/page',
                        component: jest.fn(),
                        guards: [],
                        children: []
                    }
                ]
            });
        });

        it('should navigate with query param and wildcard', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/');
                done();
            });
            setup('/*?message=Hello%20there', {
                routes: [
                    {
                        path: '/',
                        component: jest.fn(),
                        guards: [],
                        children: []
                    }
                ]
            });
        });

        it('should navigate with query param and wildcard', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/');
                done();
            });
            setup('*?message=Hello%20there', {
                routes: [
                    {
                        path: '/',
                        component: jest.fn(),
                        guards: [],
                        children: []
                    }
                ]
            });
        });

        it('should navigate with wildcard and children', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/relevant');
                done();
            });
            setup('/*/relevant', {
                routes: [
                    {
                        path: '/*',
                        component: jest.fn(),
                        guards: [],
                        children: [
                            {
                                path: '/relevant',
                                component: jest.fn(),
                                guards: [],
                                children: []
                            }
                        ]
                    }
                ]
            });
        });

        it('should navigate with wildcard and children without slash', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/relevant');
                done();
            });
            setup('/*/relevant', {
                routes: [
                    {
                        path: '*',
                        component: jest.fn(),
                        guards: [],
                        children: [
                            {
                                path: '/relevant',
                                component: jest.fn(),
                                guards: [],
                                children: []
                            }
                        ]
                    }
                ]
            });
        });

        it('should navigate to first route before wildcard', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('/about');
                done();
            });
            setup('/about', {
                routes: [
                    {
                        path: '/about',
                        component: jest.fn()
                    },
                    {
                        path: '*',
                        component: jest.fn()
                    }
                ]
            });
        });

        it('should navigate to wildcard first', done => {
            eventBus.subscribe(VInternalEventName.NAVIGATED, (r: VRoute) => {
                expect(r.path).toEqual('*');
                done();
            });
            setup('/about', {
                routes: [
                    {
                        path: '*',
                        component: jest.fn()
                    },
                    {
                        path: '/about',
                        component: jest.fn()
                    }
                ]
            });
        });
    });
});