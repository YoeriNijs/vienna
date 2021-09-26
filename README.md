# Vienna (experimental, still in development)
## Because small code is also nice

Vienna is a small JS framework that is still under active development. The idea is to create a tiny framework that may help other developers to create webapps with ease. Vienna relies heavily on decorators.

For me, it is just a way to discover how frameworks like Angular actually work under the hood. Some core ideas are based on Angular.

Currently, I am working on variable binding, dependency injection and more. There is already a basic routing. Also, I've implemented basic variable binding.

Just some snippets (may not be up to date). I will improve the documentation later.

```
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
export class DemoApplication {}
```

```
import {VComponent} from "../../core/component/v-component";
import {VInit} from "../../core/router/hooks/v-init";

interface ContactInformation {
	email: string;
}

interface User {
	name: string;
	contact: ContactInformation;
}

@VComponent({
	selector: 'main',
	styles: [`
		.welcome { 
		    background-color: red; 
		    padding: 10px; 
		    border-radius: 8px; 
        }
	`],
	html: `
		<div class="welcome">{{ welcomeMsg }}, {{ user.name }} ({{ user.contact.email }})</div>
		<div data-v-click="sayHi()">Say hi!</div>
		<a href="#/hello">navigate to hello world</a>
	`
})
export class MainComponent implements VInit {
	welcomeMsg = 'Hi there';
	user: User = {
		name: 'Young padawan',
		contact: {
			email: 'young@padawan.com'
		}
	};

	vInit(): void {
		console.log('This is fired when the component is initialized');
	}

	sayHi(): void {
		alert('hi!');
	}
}

```
