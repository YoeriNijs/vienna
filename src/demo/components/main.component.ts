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
		.welcome { background-color: red; padding: 10px; border-radius: 8px; }
	`],
	html: `
		<div class="welcome">
			{{ welcomeMsg }}, {{ user.name }} ({{ user.contact.email }})
		</div>
		<div data-v-click="testHelloWorld($this)">fire hello world method</div>
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
		console.log('In init lifecycle hook');
	}

	testHelloWorld(target: HTMLElement): void {
		// Todo: implement variables, so we are able to pass more
		console.log('a click handler', target);
	}

	navigateToHelloWorldComponent(): void {
	}
}
