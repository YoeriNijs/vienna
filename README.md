# Vienna (very alpha, still in development)
## Because small code is also nice

Vienna is a small framework under active development and, for me, just a way to discover how frameworks like Angular actually work under the hood. Vienna is based on some core fundamentals of Angular.

This is just one big WIP. Please, forgive my ugly code, lack of unit tests and documentation, and so on.

Just some snippets to illustrate what the idea is (may not be up to date). Documentation will be improved later.

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

# Todo
- Implement dependency injection
- Pass variables with template method calls
- Implement input bindings
- Add unit tests
- Add demo html page
- Render nested components
- Work with global styling somehow
