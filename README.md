# Vienna (very alpha, still in development)

## Because small code is also nice

Vienna is a small framework under active development and, for me, just a way to discover how frameworks like Angular
actually work under the hood. Vienna is based on some core fundamentals of Angular.

This is just one big WIP. Please, forgive my ugly code, lack of unit tests and documentation, and so on.

Just some snippets to illustrate what the idea is (may not be up to date). Documentation will be improved later.

Application:

```
@VApplication({
    declarations: [
        FooterComponent,
        DashboardComponent,
        HomeComponent,
        NavbarComponent,
        PersonalComponent
    ],
    routes: [
        {path: '/', component: HomeComponent},
        {path: '/personal', component: PersonalComponent},
    ],
    routeNotFoundStrategy: VRouteNotFoundStrategy.ROOT,
})
export class DemoApplication {
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
    selector: 'app-main',
    styles: [`
        .member-area,
        .public-area {
            display: flex;
            flex-direction: column;
            margin: 10px 0;
        }
        
        .btn-menu {
            margin-top: 4px;
        }
	`],
    html: `
        <app-navbar></app-navbar>
        
		<section data-v-if="isLoggedIn()">
			<div class="member-area">
				<span>Hi there, {{ user.name }}!</span>
				
				<app-dashboard></app-dashboard>
				
				<div class="btn-menu">
                    <button data-v-click="logoff(user.name)">Log off</button>
				</div>
			</div>
		</section>
		
		<section data-v-if-not="isLoggedIn()">
		    <div class="public-area">
		        <span>Hi, please log in first.</span>
                <div class="btn-menu">
                    <button data-v-click="login(user.name)">Login</button>
                </div>
            </div>
        </section>
		
		<app-footer></app-footer>
	`,
})
export class HomeComponent implements VInit {
    user: User = {
        name: 'Young padawan',
        contact: {
            email: 'young@padawan.com',
        },
    };

    constructor(protected loginService: LoginService) {
    }

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
}
```

# Todo

- Implement input bindings
- Add unit tests
- Work with global styling somehow
- Fix events that are fired multiple times
- Support query params
