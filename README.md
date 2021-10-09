# Vienna (very alpha, still in development)
## Because small code is also nice

Vienna is a small framework under active development and, for me, just a way to discover how frameworks like Angular actually work under the hood. Vienna is based on some core fundamentals of Angular.

This is just one big WIP. Please, forgive my ugly code, lack of unit tests and documentation, and so on.

Just some snippets to illustrate what the idea is (may not be up to date). Documentation will be improved later.

Application:
```
@VApplication({
	declarations: [
		MainComponent,
		HelloWorldComponent
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
```

Component:
```
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
		.header {
			display: flex;
			justify-content: space-between;
			border: 1px solid black;
			border-radius: 8px;
			padding: 10px;
		}
		
		.body {
			background-color: red; 
			padding: 10px;
			
			.status {
				display: flex;
				flex-direction: column;
			}
		}
	`],
	html: `
		<section class="header">
			<div class="title">My fancy app</div>
			<div class="nav">
				<span>Logged in: {{ loginService.isLoggedIn }}</span>
			</div>
		</section>
		
		<section class="body">
			<div data-v-if="isLoggedIn()" class="status">
				<span>Hi there, {{ user.name }}!</span>
				<ul>
					<li data-v-for="calculateMenuItems()">
						<a href="#/hello">navigate to hello world</a>
					</li>
				</ul>
				<button data-v-click="logoff(user.name)">Log off</button>
			</div>
			<button data-v-if-not="isLoggedIn()" data-v-click="login(user.name)">Login</button>
		</section>
	`
})
export class MainComponent implements VInit {
	user: User = {
		name: 'Young padawan',
		contact: {
			email: 'young@padawan.com'
		}
	};

	constructor(protected loginService: LoginService) {}

	vInit(): void {
		this.user.name = 'Piet';
	}

	login(name: string): void {
		this.loginService.login(name);
	}

	logoff(name: string): void {
		this.loginService.logoff(name);
	}

	isLoggedIn(): boolean {
		return this.loginService.isLoggedIn;
	}

	calculateMenuItems() {
		return 2;
	}
}
```

# Todo
- Implement input bindings
- Add unit tests
- Add demo html page
- Render nested components
- Work with global styling somehow
