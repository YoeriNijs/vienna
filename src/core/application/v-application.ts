import {VRouter} from '../router/v-router';
import {VInternalRenderer} from '../renderer/v-internal-renderer';
import {VRoute} from '../router/v-route';
import {VApplicationConfig} from './v-application-config';
import {Type, VInjector} from '../injector/v-injector';
import {VRenderError} from "../renderer/v-render-error";
import {VComponentType} from '../component/v-component-type';
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalRouterOptions} from "../router/v-internal-router-options";
import {VInternalProxyMapper} from "../proxy/v-internal-proxy-mapper";

export function VApplication(config: VApplicationConfig) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        class InternalVApplication {
            private readonly _proxyMapper = new VInternalProxyMapper();
            private readonly _eventBus: VInternalEventbus;
            private readonly _mainRenderer: VInternalRenderer;
            private readonly _declarations: VComponentType[];
            private readonly _routes: VRoute[];

            constructor(private eventBus: VInternalEventbus) {
                this._eventBus = eventBus;
                this._mainRenderer = new VInternalRenderer({
                    selector: 'v-app-renderer',
                    eventBus: this._eventBus,
                    rootElementSelector: config.rootElementSelector
                });
                this._declarations = config.declarations.map((c: Type<VComponentType>) => this._proxyMapper.map(c, eventBus));
                this._routes = config.routes;

                this._eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATED, (route: VRoute) => this.renderComponentForRoute(route));
                this.initializeRouter();
            }

            private initializeRouter() {
                const routerOptions: VInternalRouterOptions = {
                    eventBus: this._eventBus,
                    routeNotFoundStrategy: config.routeNotFoundStrategy
                };
                const router = new VRouter(routerOptions);
                this._routes.forEach(route => router.addRoute(route));
            }

            private renderComponentForRoute(route: VRoute): void {
                const root = this._declarations.find((declaredComponent) => declaredComponent instanceof (route.component as any));
                if (root) {
                    this._mainRenderer.renderAllFromRootNode(root, this._declarations);
                    this._eventBus.subscribe(VInternalEventName.REBUILD, () => this._mainRenderer.renderAllFromRootNode(root, this._declarations));
                } else {
                    throw new VRenderError(`Cannot find declaration for path '${route.path}'. Declare a class for this path in your Vienna application configuration.`);
                }
            }
        }

        return class extends target {
            constructor(...args: any[]) {
                super(...args);

                const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus);
                new InternalVApplication(eventBus);
            }
        };
    }

    return override;
}
