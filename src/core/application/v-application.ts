import {VInternalRenderer} from '../renderer/v-internal-renderer';
import {VRoute} from '../router/v-route';
import {VApplicationConfig} from './v-application-config';
import {Type, VInjector} from '../injector/v-injector';
import {VRenderError} from "../renderer/v-render-error";
import {VComponentType} from '../component/v-component-type';
import {VInternalEventbus} from "../eventbus/v-internal-eventbus";
import {VInternalEventName} from "../eventbus/v-internal-event-name";
import {VInternalApplicationSelectors} from "./v-internal-application-selectors";
import {VInternalRouter} from "../router/v-internal-router";
import {VDarkMode} from "../style/v-dark-mode";
import {VActivatedRoute} from "../router/v-activated-route";

export function VApplication(config: VApplicationConfig) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        class InternalVApplication {
            private readonly _mainRenderer: VInternalRenderer;
            private readonly _declarationTypes: Type<VComponentType>[];
            private readonly _routes: VRoute[];

            constructor(private _eventBus: VInternalEventbus,
                        private _activatedRoute: VActivatedRoute,
                        private _darkModeService: VDarkMode) {
                this._mainRenderer = new VInternalRenderer({
                    selector: VInternalApplicationSelectors.V_APP_RENDERER,
                    eventBus: this._eventBus,
                    rootElementSelector: config.rootElementSelector,
                    globalStyles: config.globalStyles
                });
                this._declarationTypes = config.declarations;
                this._routes = config.routes;

                this._eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATED, (route: VRoute) => {
                    this.renderComponentForRoute(route);
                    this.eventBus.publish(VInternalEventName.NAVIGATION_ENDED, route);
                });

                this.initializeDarkMode();
                this.initializeActivatedRoute();
                this.initializeRouter();
            }

            private initializeActivatedRoute(): void {
                this._activatedRoute.initialize(this._routes);
            }

            private async initializeRouter() {
                const router = new VInternalRouter({
                    eventBus: this._eventBus,
                    routes: this._routes,
                    routeNotFoundStrategy: config.routeNotFoundStrategy
                });
                await router.start();
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

            private initializeDarkMode(): void {
                const isDarkModeEnabledInConfig = config.darkModeEnabled ? config.darkModeEnabled() : false;
                if (isDarkModeEnabledInConfig) {
                    this._darkModeService.enableDarkMode();
                } else {
                    this._darkModeService.disableDarkMode();
                }

                const darkModeCssClassOverride = config.darkModeCssClassOverride;
                if (darkModeCssClassOverride) {
                    this._darkModeService.overrideGlobalDarkModeClass(darkModeCssClassOverride);
                }
            }
        }

        return class extends target {
            constructor(...args: any[]) {
                super(...args);

                const eventBus = VInjector.resolve<VInternalEventbus>(VInternalEventbus);
                const activatedRoute = VInjector.resolve<VActivatedRoute>(VActivatedRoute);
                const darkMode = VInjector.resolve<VDarkMode>(VDarkMode);
                new InternalVApplication(eventBus, activatedRoute, darkMode);
            }
        };
    }

    return override;
}
