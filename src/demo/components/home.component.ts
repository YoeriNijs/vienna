import {VComponent, VInit} from '../../core';
import {LoginService} from './login.service';

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
