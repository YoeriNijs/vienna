import {VRouter} from "../router/v-router";
import {VRenderer} from "../renderer/v-renderer";
import {VRouterEvents, VRouterNavigatedEvent} from "../router/v-router-event";
import {VComponentType, VRoute} from "../router/v-route";
import {VInternalComponent} from "../internal/v-internal-component";
import {VApplicationConfig} from "./v-application-config";
import { Type, VComponentInjector } from "../injector/v-component-injector";

export function VApplication(config: VApplicationConfig) {
	function override<T extends new (...arg: any[]) => any>(target: T) {

		@VInternalComponent({
			name: 'VApplication'
		})
		class InternalVApplication {
			private readonly _mainRenderer: VRenderer = new VRenderer({
				selector: 'v-app-renderer'
			});
			private readonly _declarations: VComponentType[] = config.declarations.map((c: Type<VComponentType>) =>
				VComponentInjector.resolve<VComponentType>(c));
			private readonly _routes: VRoute[] = config.routes;

			constructor() {
				document.addEventListener(VRouterEvents.NAVIGATED, (event: VRouterNavigatedEvent<VRoute>) => {
					this._declarations.filter(declaredComponent => declaredComponent instanceof event.detail.component)
						.forEach(component => this._mainRenderer.render(component, this._declarations));
				});

				const router = new VRouter(config.routeNotFoundStrategy);
				this._routes.forEach(route => router.addRoute(route));
			}
		}

		return class extends target {
			constructor(...args: any[]){
				super(...args);
				new InternalVApplication();
			}
		};
	}
	return override;
}
