import {VComponent, VInit} from '../../core';
import {LoginService} from './login.service';

interface ContactInformation {
    email: string;
}

interface User {
    name: string;
    password: string;
    contact: ContactInformation;
}

@VComponent({
    selector: 'app-home',
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
		        <input id="username" type="text" placeholder="Username" minlength="1"/>
		        <input id="password" type="password" placeholder="Password" minlength="1"/>
<!--                <div class="btn-menu">-->
<!--                    <button data-v-click="login">Login</button>-->
<!--                </div>-->
            </div>
        </section>
		
		<app-footer></app-footer>
	`,
})
export class HomeComponent implements VInit {
    user: User = {
        name: 'user',
        password: 'password',
        contact: {
            email: 'young@padawan.com',
        },
    };

    constructor(protected loginService: LoginService) {
    }

    vInit(): void {
        setTimeout(() => {
            const el = document.getElementsByTagName('app-home')[0];
            const self: Document = (el as any).self();
            const username = (self.getElementById('username') as HTMLInputElement).value;
            const password = self.getElementById('password');
            console.log(username, password);
        }, 2000);
    }

    login(): void {
        const el = document.getElementsByTagName('app-home')[0];
        const self: Document = (el as any).self();
        const username = self.getElementById('username').nodeValue;
        const password = self.getElementById('password').nodeValue;
        if (username === this.user.name && password == this.user.password) {
            this.loginService.login(username);
        } else {
            // alert('Invalid credentials');
        }
    }

    logoff(name: string): void {
        this.loginService.logoff(name);
    }

    isLoggedIn(): boolean {
        return this.loginService.isLoggedIn;
    }
}
