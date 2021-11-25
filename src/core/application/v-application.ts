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
import {VInternalRevocableProxy} from "../proxy/v-internal-revocable-proxy";

export function VApplication(config: VApplicationConfig) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        class InternalVApplication {
            private readonly _proxyMapper = new VInternalProxyMapper();
            private readonly _eventBus: VInternalEventbus;
            private readonly _mainRenderer: VInternalRenderer;
            private readonly _routes: VRoute[];

            private _revocableProxies: VInternalRevocableProxy<VComponentType>[] = [];
            private _canRevokeProxies = false;

            constructor(private eventBus: VInternalEventbus) {
                this._eventBus = eventBus;
                this._mainRenderer = new VInternalRenderer({
                    selector: 'v-app-renderer',
                    eventBus: this._eventBus,
                    rootElementSelector: config.rootElementSelector
                });
                this._routes = config.routes;

                this.initializeRouter();
            }

            private initializeRouter() {
                const routerOptions: VInternalRouterOptions = {
                    eventBus: this._eventBus,
                    routeNotFoundStrategy: config.routeNotFoundStrategy
                };
                const router = new VRouter(routerOptions);
                this._routes.forEach(route => router.addRoute(route));
                this._eventBus.subscribe<VRoute>(VInternalEventName.NAVIGATED, (r: VRoute) => this.renderRoute(r));
                this._eventBus.subscribe<VRoute>(VInternalEventName.RENDERING_STARTED, () => this._canRevokeProxies = false);
                this._eventBus.subscribe<VRoute>(VInternalEventName.RENDERING_FINISHED, () => this._canRevokeProxies = true);
            }

            private renderRoute(route: VRoute): void {
                console.log('render', route);
                this._revocableProxies.filter(() => this._canRevokeProxies === true).forEach(p => p.revoke());
                this._revocableProxies = config.declarations.map((c: Type<VComponentType>) => this._proxyMapper.map(c, this._eventBus));
                const declarations = this._revocableProxies.map(p => p.proxy);
                const rootComponent = declarations.find((component) => component instanceof (route.component as any));
                if (rootComponent) {
                    this._mainRenderer.renderAllFromRootNode(rootComponent, declarations);
                    this._eventBus.subscribe(VInternalEventName.REBUILD, () => this.rebuild(rootComponent));
                } else {
                    throw new VRenderError(`Cannot find declaration for path '${route.path}'. Declare a class for this path in your Vienna application configuration.`);
                }
            }

            private rebuild(root: VComponentType) {
                const revocableProxies = config.declarations.map((c: Type<VComponentType>) => this._proxyMapper.map(c, this._eventBus));
                const declarations = revocableProxies.map(p => p.proxy);
                this._mainRenderer.renderAllFromRootNode(root, declarations);
            }

            private clearAllTimeouts(): void {
                let id = window.setTimeout(() => {}, 0);
                while (id--) window.clearTimeout(id);
            }

            private clearAllIntervals(): void {
                let id = window.setInterval(() => {}, 0);
                while (id--) window.clearInterval(id);
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
