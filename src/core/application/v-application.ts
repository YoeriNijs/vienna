import {VRouter} from '../router/v-router';
import {VRenderer} from '../renderer/v-renderer';
import {VRouterEvents, VRouterNavigatedEvent} from '../router/v-router-event';
import {VComponentType, VRoute} from '../router/v-route';
import {VInternalComponent} from '../internal/v-internal-component';
import {VApplicationConfig} from './v-application-config';
import {Type, VComponentInjector} from '../injector/v-component-injector';
import {VRenderEvents} from "../renderer/v-render-events";
import {VRenderError} from "../renderer/v-render-error";

export function VApplication(config: VApplicationConfig) {
    function override<T extends new(...arg: any[]) => any>(target: T) {
        @VInternalComponent({
            name: 'VApplication',
        })
        class InternalVApplication {
            private readonly _mainRenderer: VRenderer = new VRenderer({
                selector: 'v-app-renderer',
            });

            // private readonly _declarations: VComponentType[] = config.declarations.map((c: Type<VComponentType>) => VComponentInjector.resolve<VComponentType>(c));
            private readonly _declarations: VComponentType[] = config.declarations.map((c: Type<VComponentType>) => VComponentInjector.resolve<VComponentType>(c));

            private readonly _routes: VRoute[] = config.routes;

            constructor() {
                document.addEventListener(VRouterEvents.NAVIGATED, (event: VRouterNavigatedEvent<VRoute>) => {
                    const root = this._declarations.find((declaredComponent) => declaredComponent instanceof event.detail.component);
                    if (root) {
                        this._mainRenderer.renderRoot(root, this._declarations);
                        document.addEventListener(VRenderEvents.RENDER, () => this._mainRenderer.renderRoot(root, this._declarations));
                    } else {
                        throw new VRenderError(`Cannot find declaration for path '${event.detail.path}'. Declare a class for this path in your Vienna application configuration.`);
                    }
                });

                const router = new VRouter(config.routeNotFoundStrategy);
                this._routes.forEach(route => router.addRoute(route));
            }
        }

        return class extends target {
            constructor(...args: any[]) {
                super(...args);
                new InternalVApplication();
            }
        };
    }

    return override;
}
