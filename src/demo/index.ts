import {HelloWorldComponent} from "./components/hello-world.component";
import {MainComponent} from "./components/main.component";
import {VApplication} from "../core/application/v-application";

@VApplication({
	declarations: [
		new MainComponent(),
		new HelloWorldComponent()
	],
	routes: [
		{ path: '/', component: MainComponent },
		{ path: '/hello', component: HelloWorldComponent }
	]
})
export class DemoApplication {
	constructor() {
		console.log('Initialize demo application...');
	}
}
