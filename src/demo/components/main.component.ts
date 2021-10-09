import { VComponent, VInit } from '../../core';
import { LoginService } from './login.service';

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
	`,
})
export class MainComponent implements VInit {
	user: User = {
	  name: 'Young padawan',
	  contact: {
	    email: 'young@padawan.com',
	  },
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
