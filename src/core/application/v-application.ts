import {VRouter} from "../router/v-router";
import {VRenderer} from "../renderer/v-renderer";
import {VRouterEvents, VRouterNavigatedEvent} from "../router/v-router-event";
import {VRoute} from "../router/v-route";
import {VInternalComponent} from "../internal/v-internal-component";
import {VApplicationConfig} from "./v-application-config";

export function VApplication(config: VApplicationConfig) {
	function override<T extends new (...arg: any[]) => any>(target: T) {

		@VInternalComponent({
			name: 'VApplication'
		})
		class InternalVApplication {
			private readonly _mainRenderer: VRenderer = new VRenderer({
				selector: 'v-app-renderer'
			});
			private readonly _declarations: any[] = config.declarations;
			private readonly _routes: VRoute[] = config.routes;

			constructor() {
				document.addEventListener(VRouterEvents.NAVIGATED, (event: VRouterNavigatedEvent<VRoute>) => {
					const component = this._declarations.find(declaredComponent =>
						declaredComponent instanceof event.detail.component);
					if (component) {
						this._mainRenderer.render(component);
					}
				});

				const router = new VRouter();
				this._routes.forEach(route => router.addRoute(route));
				router.navigate();
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
