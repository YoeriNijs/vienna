import {HelloWorldComponent} from "./components/hello-world.component";
import {MainComponent} from "./components/main.component";
import {VApplication} from "../core/application/v-application";
import { VRouteNotFoundStrategy } from "../core/router/v-route-not-found-strategy";

@VApplication({
	declarations: [
		new MainComponent(),
		new HelloWorldComponent()
	],
	routes: [
		{ path: '/', component: MainComponent },
		{ path: '/hello', component: HelloWorldComponent }
	],
	routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT
})
export class DemoApplication {
	constructor() {
		console.log('Initialize demo application...');
	}
}
