import {VInternalRenderer} from '../renderer/v-internal-renderer';
import {VRoute} from '../router/v-route';
import {VApplicationConfig} from './v-application-config';
import {Type, VInjector} from '../injector/v-injector';
import {VRenderError} from "../renderer/v-render-error";
import {VComponentType} from '../component/v-component-type';
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalRouterOptions} from "../router/v-internal-router-options";
import {VInternalApplicationSelectors} from "./v-internal-application-selectors";
import {VInternalRouter} from "../router/v-internal-router";

export function VApplication(config: VApplicationConfig) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        class InternalVApplication {
            private readonly _eventBus: VInternalEventbus;
            private readonly _mainRenderer: VInternalRenderer;
            private readonly _declarationTypes: Type<VComponentType>[];
            private readonly _routes: VRoute[];

            constructor(private eventBus: VInternalEventbus) {
                this._eventBus = eventBus;
                this._mainRenderer = new VInternalRenderer({
                    selector: VInternalApplicationSelectors.V_APP_RENDERER,
                    eventBus: this._eventBus,
                    rootElementSelector: config.rootElementSelector,
                    globalStyles: config.globalStyles
                });
                this._declarationTypes = config.declarations;
                this._routes = config.routes;

                this._eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATED, (route: VRoute) => {
                    this.renderComponentForRoute(route)
                });
                this.initializeRouter();
            }

            private initializeRouter() {
                const routerOptions: VInternalRouterOptions = {
                    eventBus: this._eventBus,
                    routeNotFoundStrategy: config.routeNotFoundStrategy
                };
                const router = new VInternalRouter(routerOptions);
                this._routes.forEach(route => router.addRoute(route));
            }

            private renderComponentForRoute(route: VRoute): void {
                const rootNode = this._declarationTypes.find(declaration => declaration === route.component);
                if (rootNode) {
                    this._mainRenderer.renderAllFromRootNode(rootNode, this._declarationTypes);
                    this._eventBus.unsubscribe(VInternalEventName.REBUILD);
                    this._eventBus.subscribe(VInternalEventName.REBUILD, () => {
                        this._mainRenderer.renderAllFromRootNode(rootNode, this._declarationTypes)
                    });
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
